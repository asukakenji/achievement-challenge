package com.github.asukakenji.achievement;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class Player {

	private String username;
	private String password;
	private int lv;
	private long xp;
	private long lp;
	private long chips;
	private Set<String> achievements;
	private List<String> mbox;  // Should be List<Mail>

	public Player(final String username, final String password) {
		this(username, password, 1, 0, 100, 3000, new HashSet<String>(), new LinkedList<String>());
	}

	public Player(
			final String username,
			final String password,
			final int lv,
			final long xp,
			final long lp,
			final long chips,
			final Set<String> achievements,
			final List<String> mbox) {
		if (username == null) throw new NullPointerException();
		if ("".equals(username)) throw new IllegalArgumentException();
		if (password == null) throw new NullPointerException();
		if ("".equals(password)) throw new IllegalArgumentException();
		if (lv < 1) throw new IllegalArgumentException();
		if (xp < 0) throw new IllegalArgumentException();
		if (lp < 0) throw new IllegalArgumentException();
		if (chips < 0) throw new IllegalArgumentException();
		if (achievements == null) throw new NullPointerException();
		if (mbox == null) throw new NullPointerException();
		this.username = username;
		this.password = password;
		this.lv = lv;
		this.xp = xp;
		this.lp = lp;
		this.chips = chips;
		this.achievements = achievements;
		this.mbox = mbox;
	}

	public final String getUsername() {
		return this.username;
	}

	public final boolean isPasswordMatch(final String password) {
		return this.password.equals(password);
	}

	public final int getLv() {
		return this.lv;
	}

	public final long getXp() {
		return this.xp;
	}

	public final long getLp() {
		return this.lp;
	}

	public final long getChips() {
		return this.chips;
	}

	public final boolean hasAchievement(final String achievement) {
		return this.achievements.contains(achievement);
	}

	// TODO
	public final List<String> getMails() {
		return new ArrayList<String>(this.mbox);
	}

	public final void incLv(final int amount) {
		this.lv += amount;
	}

	public final void incXp(final long amount) {
		this.xp += amount;
	}

	// TODO
	public final void receiveAll() {
		this.mbox.clear();
	}

}
