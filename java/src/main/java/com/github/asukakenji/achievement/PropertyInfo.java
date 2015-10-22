package com.github.asukakenji.achievement;

import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * {@code PropertyInfo} is the class used to store information about the
 * properties of a class. It is similar to what {@code JavaBeans} does, but it
 * does not make use of reflection. All the information is exposed at compile
 * time to increase the performance. The methods could be obtained by Java SE 8
 * Method References, and thus no reflection is involved.
 *
 * @param <E> the type of the object
 * @param <T> the type of the property of the object
 *
 * @author asukakenji
 *
 */
public final class PropertyInfo<E, T> {
	private final Class<T> propertyClass;
	private final Function<E, T> propertyGetter;
	private final BiConsumer<E, T> propertySetter;
	private final BiConsumer<E, T> propertyIncrementer;

	public PropertyInfo(
			final Class<T> propertyClass,
			final Function<E, T> propertyGetter,
			final BiConsumer<E, T> propertySetter,
			final BiConsumer<E, T> propertyIncrementer) {
		this.propertyClass = propertyClass;
		this.propertyGetter = propertyGetter;
		this.propertySetter = propertySetter;
		this.propertyIncrementer = propertyIncrementer;
	}

	public final Class<T> getPropertyClass() {
		return this.propertyClass;
	}

	public final Function<E, T> getPropertyGetter() {
		return this.propertyGetter;
	}

	public final BiConsumer<E, T> getPropertySetter() {
		return this.propertySetter;
	}

	public final BiConsumer<E, T> getPropertyIncrementer() {
		return this.propertyIncrementer;
	}

}
