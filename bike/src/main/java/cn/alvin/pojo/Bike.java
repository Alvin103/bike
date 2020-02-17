package cn.alvin.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;

//Bike这个类，以后跟Mongod中的bikes collection关联上了
@Document(collection = "bikes")
public class Bike {
	
	//主键（唯一、建立索引），id 对应mongodb中的 ——id
	@Id
	private String id;
	
	//private double longitude;
	
	//private double latitude;
	
	//表示经纬度的数组[经度， 纬度]
	@GeoSpatialIndexed(type=GeoSpatialIndexType.GEO_2DSPHERE)
	private Double[] location;
	
	//建立索引
	@Indexed
	private Long bikeNo;
	
	private int status;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}


	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Long getBikeNo() {
		return bikeNo;
	}

	public void setBikeNo(Long bikeNo) {
		this.bikeNo = bikeNo;
	}

	public Double[] getLocation() {
		return location;
	}

	public void setLocation(Double[] location) {
		this.location = location;
	}
	
	
	
}
