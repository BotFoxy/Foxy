package net.cakeyfox.foxy.utils.profile

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.utils.image.ImageUtils
import net.cakeyfox.foxy.utils.image.ImageUtils.drawTextWithFont
import net.cakeyfox.foxy.utils.profile.badge.BadgeUtils
import net.cakeyfox.foxy.utils.profile.config.ProfileConfig
import net.cakeyfox.serializable.database.data.FoxyUser
import net.cakeyfox.serializable.database.data.Layout
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.exceptions.ErrorResponseException
import java.awt.Color
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.geom.Ellipse2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName
import kotlin.system.measureTimeMillis

class ProfileRender(
    private val config: ProfileConfig, private val context: FoxyInteractionContext
) {
    lateinit var graphics: Graphics2D
    lateinit var image: BufferedImage

    companion object {
        private val logger = KotlinLogging.logger(this::class.jvmName)
    }

    suspend fun create(user: User, userData: FoxyUser): ByteArray {
        val renderTime = measureTimeMillis {
            coroutineScope {
                val layoutInfoDeferred = async {
                    ProfileCacheManager.layoutCache.get(userData.userProfile.layout) {
                        context.db.utils.profile.getLayout(
                            it
                        )
                    }
                }

                val backgroundInfoDeferred = async {
                    ProfileCacheManager.backgroundCache.get(userData.userProfile.background) {
                        context.db.utils.profile.getBackground(
                            it
                        )
                    }
                }

                val layoutDeferred = async {
                    ProfileCacheManager.loadImageFromCache(Constants.PROFILE_LAYOUT(layoutInfoDeferred.await().filename))!!
                }

                val backgroundDeferred = async {
                    ProfileCacheManager.loadImageFromCache(Constants.PROFILE_BACKGROUND(backgroundInfoDeferred.await().filename))!!
                }

                val layout = layoutDeferred.await()
                val background = backgroundDeferred.await()
                val layoutInfo = layoutInfoDeferred.await()

                image = BufferedImage(layout.width, layout.height, BufferedImage.TYPE_INT_ARGB)
                graphics = image.createGraphics()
                graphics.setRenderingHint(
                    RenderingHints.KEY_TEXT_ANTIALIASING,
                    RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB
                )
                graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)

                drawBackgroundAndLayout(background, layout)
                drawUserDetails(user, userData, layoutInfo, context)
                drawBadges(userData, user, layoutInfo)
                drawUserAvatar(user, layoutInfo, userData)
                drawDecoration(userData, layoutInfo)
                cleanUp()
            }
        }

        logger.info { "Profile rendered in ${renderTime}ms" }

        return withContext(Dispatchers.IO) {
            val outputStream = ByteArrayOutputStream()
            ImageIO.write(image, "png", outputStream)
            outputStream.toByteArray()
        }
    }

    private suspend fun drawUserDetails(
        user: User,
        userData: FoxyUser,
        layout: Layout,
        context: FoxyInteractionContext
    ) {
        val color = if (layout.darkText) Color.BLACK else Color.WHITE

        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = user.name
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.username
            fontColor = color
            textPosition = layout.profileSettings.positions.usernamePosition
        }

        if (userData.marryStatus.marriedWith != null) drawMarryInfo(userData, layout)

        val formattedBalance = context.utils.formatNumber(userData.userCakes.balance, "pt", "BR")
        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = "$formattedBalance Cakes"
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.cakes
            fontColor = color
            textPosition = layout.profileSettings.positions.cakesPosition
        }

        val userAboutMe =
            ProfileUtils.formatAboutMe(userData.userProfile.aboutme ?: context.locale["profile.defaultAbouMe"], layout)

        graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
            text = userAboutMe
            fontFamily = layout.profileSettings.defaultFont
            fontSize = layout.profileSettings.fontSize.aboutme
            fontColor = color
            textPosition = layout.profileSettings.positions.aboutmePosition
        }
    }

    private suspend fun drawUserAvatar(user: User, layoutInfo: Layout, data: FoxyUser) {
        coroutineScope {
            val avatarDeferred = async {
                val avatarUrl = user.avatarUrl ?: user.defaultAvatarUrl
                val avatarWithSize = avatarUrl.plus("?size=1024")
                ImageUtils.loadImageFromURL(avatarWithSize)
            }

            val decorationDeferred = async {
                data.userProfile.decoration?.let {
                    ImageUtils.loadImageFromURL(Constants.PROFILE_DECORATION(it))
                }
            }

            val avatar = avatarDeferred.await()
            val decorationImage = decorationDeferred.await()

            val arcX = layoutInfo.profileSettings.positions.avatarPosition.arc?.x ?: 125f
            val arcY = layoutInfo.profileSettings.positions.avatarPosition.arc?.y ?: 700f
            val arcRadius = layoutInfo.profileSettings.positions.avatarPosition.arc?.radius ?: 100

            val avatarX = layoutInfo.profileSettings.positions.avatarPosition.x
            val avatarY = layoutInfo.profileSettings.positions.avatarPosition.y

            val clippingShape = arcRadius.times(2).let {
                arcRadius.times(2).let { it1 ->
                    Ellipse2D.Float(arcX.minus(arcRadius), arcY.minus(arcRadius), it.toFloat(), it1.toFloat())
                }
            }

            graphics.clip(clippingShape)
            graphics.drawImage(avatar, avatarX.toInt(), avatarY.toInt(), 200, 200, null)
            graphics.clip = null

            decorationImage?.let {
                graphics.drawImage(
                    it,
                    (config.profileWidth / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(),
                    (config.profileHeight / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(),
                    200,
                    200,
                    null
                )
            }
        }
    }

    private suspend fun drawDecoration(data: FoxyUser, layoutInfo: Layout) {
        data.userProfile.decoration?.let {
            val decorationImage = ImageUtils.loadImageFromURL(Constants.PROFILE_DECORATION(it))
            graphics.drawImage(
                decorationImage,
                (config.profileWidth / layoutInfo.profileSettings.positions.decorationPosition.x).toInt(),
                (config.profileHeight / layoutInfo.profileSettings.positions.decorationPosition.y).toInt(),
                200,
                200,
                null
            )
        }
    }

    private suspend fun drawBadges(data: FoxyUser, user: User, layoutInfo: Layout) {
        val defaultBadges = ProfileCacheManager.badgesCache.get("default") { context.db.utils.profile.getBadges() }!!

        val member = try {
            context.jda.getGuildById(Constants.SUPPORT_SERVER_ID)
                ?.retrieveMemberById(user.id)
                ?.await()
        } catch (e: ErrorResponseException) {
            if (e.errorCode == 10007) {
                null
            } else {
                throw e
            }
        }

        val userBadges = member?.let { BadgeUtils.getBadges(it, defaultBadges, data) } ?: BadgeUtils.getFallbackBadges(defaultBadges, data)

        if (userBadges.isEmpty()) {
            return
        }

        var x = layoutInfo.profileSettings.positions.badgesPosition.x
        var y = layoutInfo.profileSettings.positions.badgesPosition.y

        for (badge in userBadges) {
            val badgeImage = ImageUtils.loadImageFromURL(Constants.PROFILE_BADGES(badge.asset))
            graphics.drawImage(badgeImage, x.toInt(), y.toInt(), 50, 50, null)

            x += 60
            if (x > 1300) {
                x = layoutInfo.profileSettings.positions.badgesPosition.x
                y += 50
            }
        }
    }

    private suspend fun drawMarryInfo(userData: FoxyUser, layout: Layout) {
        val marriedDateFormatted = context.utils.convertToHumanReadableDate(userData.marryStatus.marriedDate!!)
        val marriedOverlay = ImageUtils.loadImageFromURL(Constants.MARRIED_OVERLAY(layout.id))
        val color = if (layout.darkText) Color.BLACK else Color.WHITE
        val partnerUser = context.jda.retrieveUserById(userData.marryStatus.marriedWith!!).await()

        marriedOverlay.let {
            graphics.drawImage(it, 0, 0, config.profileWidth, config.profileHeight, null)
            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = context.locale["profile.marriedWith", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.married
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedPosition
            }

            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = partnerUser.name
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedUsernamePosition
            }

            graphics.drawTextWithFont(config.profileWidth, config.profileHeight) {
                text = context.locale["profile.marriedSince", marriedDateFormatted]
                fontFamily = layout.profileSettings.defaultFont
                fontSize = layout.profileSettings.fontSize.marriedSince
                fontColor = color
                textPosition = layout.profileSettings.positions.marriedSincePosition
            }
        }
    }

    private fun drawBackgroundAndLayout(background: BufferedImage, layout: BufferedImage) {
        graphics.clearRect(0, 0, config.profileWidth, config.profileHeight)
        graphics.drawImage(background, 0, 0, config.profileWidth, config.profileHeight, null)
        graphics.drawImage(layout, 0, 0, config.profileWidth, config.profileHeight, null)
        graphics.drawRect(0, 0, config.profileWidth, config.profileHeight)
    }

    private fun cleanUp() {
        graphics.dispose()
        image.flush()
    }
}