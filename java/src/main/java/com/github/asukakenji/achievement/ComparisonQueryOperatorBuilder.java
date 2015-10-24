package com.github.asukakenji.achievement;

import java.util.function.Function;
import java.util.function.Predicate;

public class ComparisonQueryOperatorBuilder<E> {

	public static final String OP_EQ = "$eq";
	public static final String OP_GT = "$gt";
	public static final String OP_GTE = "$gte";
	public static final String OP_LT = "$lt";
	public static final String OP_LTE = "$lte";
	public static final String OP_NE = "$ne";

	@SuppressWarnings("unchecked")
	public static <E, T> Function<String, Function<T, Predicate<E>>> compileComparisonOperator(final PropertyAccessorMapper<E> pam, final String propertyName) {
		final Function<E, ?> propertyGetter = pam.getPropertyGetter(propertyName);
		return (String operatorName) -> {
			switch (operatorName) {
			case OP_EQ:
				// TODO: Add "array" behavior
				return (T value) -> (E target) ->
					propertyGetter.apply(target).equals(value);
			case OP_GT:
				return (T value) -> (E target) ->
					((Comparable<T>) propertyGetter.apply(target)).compareTo(value) > 0;
			case OP_GTE:
				return (T value) -> (E target) ->
					((Comparable<T>) propertyGetter.apply(target)).compareTo(value) >= 0;
			case OP_LT:
				return (T value) -> (E target) ->
					((Comparable<T>) propertyGetter.apply(target)).compareTo(value) < 0;
			case OP_LTE:
				return (T value) -> (E target) ->
					((Comparable<T>) propertyGetter.apply(target)).compareTo(value) <= 0;
			case OP_NE:
				// TODO: Add "array" behavior
				return (T value) -> (E target) ->
					!propertyGetter.apply(target).equals(value);
			default:
				throw new IllegalArgumentException(operatorName);
			}
		};
	}

	public static <E> ComparisonQueryOperatorBuilder<E> of(final PropertyAccessorMapper<E> pam) {
		return new ComparisonQueryOperatorBuilder<E>(pam);
	}

	private final PropertyAccessorMapper<E> pam;

	public ComparisonQueryOperatorBuilder(final PropertyAccessorMapper<E> pam) {
		this.pam = pam;
	}

	@SuppressWarnings("unchecked")
	public <T> BuilderA<E, T> addPropertyName(final String propertyName) {
		final Function<E, T> propertyGetter = (Function<E, T>) pam.getPropertyGetter(propertyName);
		return new BuilderA<E, T>(propertyGetter);
	}

	public static class BuilderA<E, T> {
		private final Function<E, T> propertyGetter;
		private BuilderA(final Function<E, T> propertyGetter) {
			this.propertyGetter = propertyGetter;
		}
		@SuppressWarnings("unchecked")
		public BuilderB<E, T> addOperatorName(final String operatorName) {
			switch (operatorName) {
			case OP_EQ:
				// TODO: Add "array" behavior
				return new BuilderB<E, T>((T value) -> (E target) ->
					this.propertyGetter.apply(target).equals(value)
				);
			case OP_GT:
				return new BuilderB<E, T>((T value) -> (E target) ->
					((Comparable<T>) this.propertyGetter.apply(target)).compareTo(value) > 0
				);
			case OP_GTE:
				return new BuilderB<E, T>((T value) -> (E target) ->
					((Comparable<T>) this.propertyGetter.apply(target)).compareTo(value) >= 0
				);
			case OP_LT:
				return new BuilderB<E, T>((T value) -> (E target) ->
					((Comparable<T>) this.propertyGetter.apply(target)).compareTo(value) < 0
				);
			case OP_LTE:
				return new BuilderB<E, T>((T value) -> (E target) ->
					((Comparable<T>) this.propertyGetter.apply(target)).compareTo(value) <= 0
				);
			case OP_NE:
				// TODO: Add "array" behavior
				return new BuilderB<E, T>((T value) -> (E target) ->
					!this.propertyGetter.apply(target).equals(value)
				);
			default:
				throw new IllegalArgumentException(operatorName);
			}
		}
	}

	public static class BuilderB<E, T> {
		private final Function<T, Predicate<E>> function;
		private BuilderB(final Function<T, Predicate<E>> function) {
			this.function = function;
		}
		public Predicate<E> addValue(final T value) {
			return this.function.apply(value);
		}
//		public BuilderC<E, T> addValue(final T value) {
//			final Predicate<E> predicate = this.function.apply(value);
//			return new BuilderC<E, T>(predicate);
//		}
	}

//	public static class BuilderC<E, T> {
//		private Predicate<E> predicate;
//		private BuilderC(final Predicate<E> predicate) {
//			this.predicate = predicate;
//		}
//		public Predicate<E> build() {
//			return this.predicate;
//		}
//		public BuilderB<E, T> addOperatorName(final String operatorName) {
//			return null;
//		}
//	}
}
