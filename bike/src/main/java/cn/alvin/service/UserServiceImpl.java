package cn.alvin.service;
 
import java.util.concurrent.TimeUnit; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.github.qcloudsms.SmsSingleSender;

import cn.alvin.pojo.User; 

@Service	//Spring注解 标记这个类被Spring容器管理
public class UserServiceImpl implements UserService {

	@Autowired
	private StringRedisTemplate stringRedisTemplate;
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Override
	public boolean sendMsg(String nationCode, String phoneNum) {
		boolean flag = true;
		// 调用腾讯云的短信API
		int appid = Integer.parseInt(stringRedisTemplate.opsForValue().get("appid"));
		String appkey = stringRedisTemplate.opsForValue().get("appkey");
		//生成一个随机数字（4位）
		String code = (int)((Math.random() * 9 + 1) * 1000) - 1 + "";
		    
			try {
				//String[] params = {"5678"};
				//String code = "5678";
				SmsSingleSender ssender = new SmsSingleSender(appid, appkey);
				//向对应手机号的用户发送短信
				
		        ssender.send(0, nationCode, phoneNum, "【BigSakana】您的注册验证码为"+code, "", "");
				//将发送的手机号作为key，验证码作为value保存到Redis中
				stringRedisTemplate.opsForValue().set(phoneNum, code, 300, TimeUnit.SECONDS);
			} catch (Exception e) {//异常
				flag = false;
				e.printStackTrace();
			}
		
		
		return flag;
	}


	@Override
	public boolean verify(String phoneNum, String verifyCode) {
		boolean flag = false;
		//调用RedisTemplate，根据手机号的key，查找对应验证码
		//redis中保存的真实验证码
		String code = stringRedisTemplate.opsForValue().get(phoneNum);
		if(code != null && code.equals(verifyCode)) {
			flag = true;
		}
		return flag;
	}


	@Override
	public void register(User user) {
		// 调用mongodb的dao,将用户数据保存起来
		mongoTemplate.insert(user); 
	}


	
	
	@Override
	public void update(User user) {
		//如果_id数据不存在，就插入，存在就更新
		//根据用户手机号对数据进行更新
		Update update = new Update();
		if(user.getDeposite() != null) {
			update.set("deposite", user.getDeposite());
		}
		if(user.getStatus() != null) {
			update.set("status", user.getStatus());
		}
		if(user.getName() != null) {
			update.set("name", user.getName());
		}
		if(user.getIdNum() != null) {
			update.set("idNum", user.getIdNum());
		}
		
		mongoTemplate.updateFirst(new Query(Criteria.where("phoneNum").is(user.getPhoneNum())), update, User.class);
		
	}
	
	
}
