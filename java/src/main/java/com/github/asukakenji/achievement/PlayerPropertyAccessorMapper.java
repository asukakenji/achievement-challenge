package com.github.asukakenji.achievement;

import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * Singleton
 */
public enum PlayerPropertyAccessorMapper implements PropertyAccessorMapper<Player> {

	INSTANCE;

	public static final PlayerPropertyAccessorMapper getInstance() {
		return INSTANCE;
	}

	public static final String KEY_LV = "lv";
	public static final String KEY_XP = "xp";
	public static final String KEY_LP = "lp";
	public static final String KEY_CHIPS = "chips";
	public static final String KEY_ACHIEVEMENTS = "achievements";
	public static final String KEY_MAILS = "mails";

	@Override
	public final Function<Player, ?> getPropertyGetter(final String propertyName) {
		switch (propertyName) {
		case KEY_LV:
			return Player::getLv;
		case KEY_XP:
			return Player::getXp;
		case KEY_LP:
			return Player::getLp;
		case KEY_CHIPS:
			return Player::getChips;
		case KEY_ACHIEVEMENTS:
			return Player::getAchievements;
		case KEY_MAILS:
			return Player::getMails;
		default:
			throw new IllegalArgumentException(propertyName);
		}
	}

	@Override
	public final BiConsumer<Player, ?> getPropertySetter(final String propertyName) {
		switch (propertyName) {
		case KEY_LV:
			return (BiConsumer<Player, Integer>) Player::setLv;
		case KEY_XP:
			return (BiConsumer<Player, Long>) Player::setXp;
		case KEY_LP:
			return (BiConsumer<Player, Long>) Player::setLp;
		case KEY_CHIPS:
			return (BiConsumer<Player, Long>) Player::setChips;
		case KEY_ACHIEVEMENTS:
			return (BiConsumer<Player, Set<String>>) Player::setAchievements;
		case KEY_MAILS:
			return (BiConsumer<Player, List<String>>) Player::setMails;
		default:
			throw new IllegalArgumentException(propertyName);
		}
	}

}
