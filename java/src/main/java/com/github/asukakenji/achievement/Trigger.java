package com.github.asukakenji.achievement;

import java.util.Arrays;
import java.util.List;
import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class Trigger {

	private final List<String> inProperties;
	private final List<String> outProperties;
	private final Predicate<TriggerTarget> predicate;
	private final Consumer<TriggerTarget> consumer;

	public Trigger(
			final List<String> inProperties,
			final List<String> outProperties,
			final Predicate<TriggerTarget> predicate,
			final Consumer<TriggerTarget> consumer) {
		this.inProperties = inProperties;
		this.outProperties = outProperties;
		this.predicate = predicate;
		this.consumer = consumer;
	}

	// Store the execution context in both a Set and a List 
	public static void test() {
		final Trigger level2trigger = new Trigger(
			Arrays.asList("lv", "xp"),
			Arrays.asList("lv"),
			((BinaryOperator<Predicate<TriggerTarget>>) Predicate<TriggerTarget>::and).apply(
				compileComparisonOperator("lv").apply("$eq").apply(1),
				compileComparisonOperator("xp").apply("$gte").apply(300)
			),
			((BinaryOperator<Consumer<TriggerTarget>>) Consumer<TriggerTarget>::andThen).apply(
				(target) -> target.setProperty("lv", 1),
				(target) -> target.incProperty("xp", -300)
			)
		);
	}

	public static void originalVersion(final Player player) {
		final int lv = player.getLv();
		final long xp = player.getXp();
		if (lv == 1 && xp >= 300) {
			player.setLv(2);
			player.setXp(player.getXp() + -300);
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> Function<String, Function<T, Predicate<TriggerTarget>>> compileComparisonOperator(final String property) {
		return (operator) -> {
			switch (operator) {
			case "$eq":
				return (value) -> (target) ->
					target.getProperty(property).equals(value);
			case "$ne":
				return (value) -> (target) ->
					!target.getProperty(property).equals(value);
			case "$gt":
				return (value) -> (target) ->
					((Comparable<T>) target.getProperty(property)).compareTo(value) > 0;
			case "$gte":
				return (value) -> (target) ->
					((Comparable<T>) target.getProperty(property)).compareTo(value) >= 0;
			case "$lt":
				return (value) -> (target) ->
					((Comparable<T>) target.getProperty(property)).compareTo(value) < 0;
			case "$lte":
				return (value) -> (target) ->
					((Comparable<T>) target.getProperty(property)).compareTo(value) <= 0;
			default:
				throw new IllegalArgumentException(operator);
			}
		};
	}

	public static Function<List<Predicate<TriggerTarget>>, Predicate<TriggerTarget>> compileLogicalOperator(final String operator) {
		switch (operator) {
		case "$and":
			return (predicates) ->
				predicates.stream().reduce((target) -> true, Predicate<TriggerTarget>::and);
		case "$or":
			return (predicates) ->
				predicates.stream().reduce((target) -> false, Predicate<TriggerTarget>::or);
		default:
			throw new IllegalArgumentException(operator);
		}
	}

	public static Function<String, Function<?, Consumer<TriggerTarget>>> compileUpdateOperator(final String operator) {
		switch (operator) {
		case "$inc":
			return (property) -> (value) -> (target) ->
				target.incProperty(property, value);
		default:
			throw new IllegalArgumentException(operator);
		}
	}

}
