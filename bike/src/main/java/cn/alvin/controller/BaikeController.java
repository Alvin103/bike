package cn.alvin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.alvin.pojo.Bike;
import cn.alvin.service.BikeService; 
/**
 * 标记这个类是一个用于介绍请求和响应用户的控制器
 * 加上@Controller注解后，Spring容器就会对他实例化
 * @author Administrator
 *
 */
@Controller
public class BaikeController {
	
	//到spring 容器中，查找BikeService类型的实例，然后注入到BikeController实例中
	@Autowired
	private BikeService bikeService;
	
	@RequestMapping("/bike/add")
	@ResponseBody
	public String add(@RequestBody Bike bike) {	//加上RequestBody 因为 发过来的json数据
		//System.out.print(bike);
		//调用service 将数据保存到MongoDB中
		bikeService.sava(bike);
		return "success";
	}
	
	@RequestMapping("/bike/findNear")
	@ResponseBody
	public List<GeoResult<Bike>> findNear(double longitude, double latitude) {
		//调用service 将数据保存到MongoDB中
		 List<GeoResult<Bike>> bikes = bikeService.findNear(longitude, latitude);
		return bikes;
	}

}
