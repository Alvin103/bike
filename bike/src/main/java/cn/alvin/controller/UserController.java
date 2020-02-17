package cn.alvin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.alvin.pojo.User;
import cn.alvin.service.UserService;

@Controller		//标记Controller 交给Spring管理
public class UserController {
	//接收用户请求的参数并且将相应的数据响应给用户
	@Autowired	//按类型注入
	private UserService userService;//引用接口
	
	@RequestMapping("/user/genCode")	//与小程序的请求一致
	@ResponseBody
	public boolean genVerifyCode(String nationCode, String phoneNum) {
		boolean flag = userService.sendMsg(nationCode, phoneNum);//sendMsg方法传递用户输入的国家编码和电话号码
		return flag;
	}
	
	@RequestMapping("/user/verify")
	@ResponseBody
	public boolean verify(String phoneNum, String verifyCode) {
		return userService.verify(phoneNum, verifyCode); 
	}

	@RequestMapping("/user/register")
	@ResponseBody
	public boolean reg( User user) {	//可以在参数前加@RequestBody,接收json类型参数，set到对应实体类中的
		
		boolean flag = true;
		//调用service，将用户的数据保存起来
		try {
			userService.register(user);
		} catch (Exception e) { 
			e.printStackTrace();
			flag = false;
		}	
		return flag;
	}
	
	
	@RequestMapping("/user/deposite")
	@ResponseBody
	public boolean deposite(User user) {
		boolean flag = true; 
		try {
			userService.update(user);
		} catch (Exception e) { 
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
	
	@RequestMapping("/user/identify")
	@ResponseBody
	public boolean identify(User user) {
		boolean flag = true;
		try {
			userService.update(user);
		} catch (Exception e) { 
			e.printStackTrace();
			flag = false;
		}
		
		return flag;
	}
	
}

















