package com.github.asukakenji.achievement;

import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;

/**
 * {@code TriggerTargetPlayer} is an adapter to the {@link TriggerTarget}
 * interface for the {@link Player} class. The "Adapter Pattern" in "Design
 * Patterns" is applied. Since {@code Player} is only a simple {@code JavaBeans}
 * class, and does not support operations like "increment", more complicated
 * operations are implemented in this class using the primitive operations
 * available in {@code Player} in order to fulfill the {@code TriggerTarget}
 * interface.
 *
 * @author asukakenji
 *
 */
public class TriggerTargetPlayer implements TriggerTarget {

	public static final void incXp(final Player player, final long amount) {
		player.setXp(player.getXp() + amount);
	}

	public static final void incLp(final Player player, final long amount) {
		player.setLp(player.getLp() + amount);
	}

	public static final void incChips(final Player player, final long amount) {
		player.setChips(player.getChips() + amount);
	}

	protected final Player player;
	protected final Map<String, PropertyInfo<Player, ?>> propertyInfos;
	//private final Map<String, Map<String, List<Trigger>>> triggers;

	public TriggerTargetPlayer(final Player player) {
		this.player = player;
		this.propertyInfos = new HashMap<>();
		//this.triggers = new HashMap<>();

		propertyInfos.put("lv", new PropertyInfo<>(Integer.TYPE, Player::getLv, Player::setLv, null));
		propertyInfos.put("xp", new PropertyInfo<>(Long.TYPE, Player::getXp, null, TriggerTargetPlayer::incXp));
		propertyInfos.put("lp", new PropertyInfo<>(Long.TYPE, Player::getLp, null, TriggerTargetPlayer::incLp));
		propertyInfos.put("chips", new PropertyInfo<>(Long.TYPE, Player::getChips, null, TriggerTargetPlayer::incChips));
		//propertyInfos.put("achievements", new PropertyInfo<Player, Integer>(Set.class, Player::getAchievements, Player::setLv, null));
		//propertyInfos.put("mbox", new PropertyInfo<Player, Integer>(List.class, Player::getMbox, Player::setLv, null));
	}

	@Override
	public Class<?> getPropertyType(String key) {
		if (this.propertyInfos.containsKey(key)) {
			return this.propertyInfos.get(key).getPropertyClass();
		}
		throw new IllegalArgumentException(key);
	}

	@Override
	public Object getProperty(final String key) {
		if (this.propertyInfos.containsKey(key)) {
			return this.propertyInfos.get(key).getPropertyGetter().apply(this.player);
		}
		throw new IllegalArgumentException(key);
	}

//	@Override
//	public <T> boolean inProperty(final String key, final T element) {
//		if (this.propertyInfos.containsKey(key)) {
//			@SuppressWarnings("unchecked")
//			final Collection<? super T> c = (Collection<? super T>) this.propertyInfos.get(key).getPropertyGetter().apply(this.player);
//			return c.contains(element);
//		}
//		throw new IllegalArgumentException(key);
//	}

	@Override
	public <T> void setProperty(final String key, final T value) {
		if (this.propertyInfos.containsKey(key)) {
			@SuppressWarnings("unchecked")
			final BiConsumer<Player, ? super T> f = (BiConsumer<Player, ? super T>) this.propertyInfos.get(key).getPropertySetter();
			f.accept(this.player, value);
		}
		throw new IllegalArgumentException(key);
	}

	@Override
	public <T> void incProperty(final String key, final T amount) {
		if (this.propertyInfos.containsKey(key)) {
			@SuppressWarnings("unchecked")
			final BiConsumer<Player, ? super T> f = (BiConsumer<Player, ? super T>) this.propertyInfos.get(key).getPropertyIncrementer();
			f.accept(this.player, amount);
		}
		throw new IllegalArgumentException(key);
	}

}
