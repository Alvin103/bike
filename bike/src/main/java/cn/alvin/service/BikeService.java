package cn.alvin.service;

import java.util.List;

import org.springframework.data.geo.GeoResult;

import cn.alvin.pojo.Bike;

public interface BikeService {

	public void sava(Bike bike);

	public List<GeoResult<Bike>> findNear(double longitude, double latitude);

}
