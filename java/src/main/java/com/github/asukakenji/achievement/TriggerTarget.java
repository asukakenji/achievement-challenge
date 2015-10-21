package com.github.asukakenji.achievement;

public interface TriggerTarget {

	Class<?> getPropertyType(String key);

	Object getProperty(String key);

}
