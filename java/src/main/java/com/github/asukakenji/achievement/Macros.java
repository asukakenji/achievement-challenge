package com.github.asukakenji.achievement;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class Macros {

	private Macros() {
	}

	public static final class Pair<T1, T2> {
		public final T1 first;
		public final T2 second;

		public static final <T1, T2> Pair<T1, T2> of(final T1 first, final T2 second) {
			return new Pair<T1, T2>(first, second);
		}

		public Pair(final T1 first, final T2 second) {
			this.first = first;
			this.second = second;
		}
	}

	@SafeVarargs
	public static final <T> List<T> l(final T... arguments) {
		return Arrays.asList(arguments);
	}

	public static final <K, V> Map<K, V> m(final List<Pair<K, V>> pairs) {
		final Map<K, V> map = new LinkedHashMap<K, V>();
		for (final Pair<K, V> pair : pairs) {
			map.put(pair.first, pair.second);
		}
		return map;
	}

	public static final <K, V> Pair<K, V> p(final K key, final V value) {
		return Pair.of(key,  value);
	}

}
