package com.github.asukakenji.achievement;

import java.util.function.BiConsumer;
import java.util.function.Function;

public interface PropertyAccessorMapper<E> {

	Function<E, ?> getPropertyGetter(String propertyName);

	BiConsumer<E, ?> getPropertySetter(String propertyName);

}
