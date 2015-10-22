package com.github.asukakenji.achievement;

/**
 * {@code TriggerTarget} is the interface for targets of a trigger. A trigger
 * target contains properties that could be manipulated. A subset of MongoDB
 * operators are supported.
 *
 * @author asukakenji
 *
 */
public interface TriggerTarget {

	Class<?> getPropertyType(String key);

	Object getProperty(String key);

	//<T> boolean inProperty(String key, T element);

	<T> void setProperty(String key, T value);

	<T> void incProperty(String key, T amount);

	//<T> void pushProperty(String key, T element);

	//<T> void addPropertyToSet(String key, T element);

}
