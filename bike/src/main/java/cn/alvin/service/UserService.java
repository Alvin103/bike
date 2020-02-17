package cn.alvin.service;

import cn.alvin.pojo.User;

public interface UserService {
	
	boolean sendMsg(String nationCode, String phoneNum);

	boolean verify(String phoneNum, String verifyCode);

	void register(User user);

	void update(User user); 

}
