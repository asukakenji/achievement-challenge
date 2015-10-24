package com.github.asukakenji.achievement;

import java.util.LinkedList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class LogicalQueryOperatorBuilder<E> {

	public static final String OP_AND = "$and";
	public static final String OP_OR = "$or";

	public static <E> Function<List<Predicate<E>>, Predicate<E>> compilerLogicalOperator(final String operatorName) {
		switch (operatorName) {
		case OP_AND:
			return (List<Predicate<E>> predicates) ->
				(E target) -> { 
					for (Predicate<E> predicate : predicates) {
						if (!predicate.test(target)) return false;
					}
					return true;
				};
		case OP_OR:
			return (List<Predicate<E>> predicates) ->
				(E target) -> { 
					for (Predicate<E> predicate : predicates) {
						if (predicate.test(target)) return true;
					}
					return false;
				};
		default:
			throw new IllegalArgumentException(operatorName);
		}
	}

	public static <E> LogicalQueryOperatorBuilder<E> of(final String operatorName) {
		switch (operatorName) {
		case OP_AND:
			return new LogicalQueryOperatorBuilder<E>(
				(List<Predicate<E>> predicates) ->
					(E target) -> { 
						for (Predicate<E> predicate : predicates) {
							if (!predicate.test(target)) return false;
						}
						return true;
					}
			);
		case OP_OR:
			return new LogicalQueryOperatorBuilder<E>(
				(List<Predicate<E>> predicates) ->
					(E target) -> { 
						for (Predicate<E> predicate : predicates) {
							if (!predicate.test(target)) return false;
						}
						return true;
					}
			);
		default:
			throw new IllegalArgumentException(operatorName);
		}
	}

	private final Function<List<Predicate<E>>, Predicate<E>> function;
	private final List<Predicate<E>> predicates;

	private LogicalQueryOperatorBuilder(final Function<List<Predicate<E>>, Predicate<E>> function) {
		this.function = function;
		this.predicates = new LinkedList<>();
	}

	public LogicalQueryOperatorBuilder<E> add(final Predicate<E> predicate) {
		this.predicates.add(predicate);
		return this;
	}

	public Predicate<E> build() {
		return this.function.apply(this.predicates);
	}

}
