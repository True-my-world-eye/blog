// 公告栏动态内容脚本

// 获取当前时间
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 根据时间返回不同的问候语
function getGreeting() {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) {
    return '早上好';
  } else if (hours >= 12 && hours < 14) {
    return '中午好';
  } else if (hours >= 14 && hours < 18) {
    return '下午好';
  } else if (hours >= 18 && hours < 22) {
    return '晚上好';
  } else {
    return '夜生活嗨起来';
  }
}

// 获取站长IP地址（服务器IP）
async function getServerIP() {
  try {
    // 在本地开发环境中使用模拟数据
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '192.168.1.1'; // 本地开发环境下的模拟数据
    }
    
    // 在生产环境中，使用服务器的实际IP
    // 这里可以直接返回服务器IP，因为静态网站部署后，这个IP就是固定的
    // 可以在部署前手动设置为服务器的实际IP
    return window.location.hostname; // 使用当前域名作为服务器IP
  } catch (error) {
    console.error('获取服务器IP失败:', error);
    return window.location.hostname || '127.0.0.1'; // 默认使用当前域名
  }
}

// 获取访客IP地址和地理位置
async function getVisitorInfo() {
  try {
    // 本地开发环境使用模拟数据
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return {
        ip: '183.247.9.127',
        province: '浙江省',
        city: '杭州市',
        district: '钱塘区',
        latitude: 30.2741,
        longitude: 120.1551
      };
    }
    
    // 生产环境使用实际API
    try {
      // 尝试使用HTTPS
      const ipResponse = await fetch('https://api.ipify.org/?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      
      // 使用IP-API获取地理位置信息
      // 注意：免费版API有请求限制，如果流量大建议使用付费API或自建服务
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      
      return {
        ip: ip,
        province: geoData.region || '未知省份',
        city: geoData.city || '未知城市',
        district: geoData.district || '',
        latitude: geoData.latitude || 0,
        longitude: geoData.longitude || 0
      };
    } catch (apiError) {
      console.error('HTTPS API调用失败，尝试备用方案:', apiError);
      // 如果HTTPS调用失败，尝试使用HTTP
      const ipResponse = await fetch('http://api.ipify.org/?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      
      const geoResponse = await fetch(`http://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      
      return {
        ip: ip,
        province: geoData.region || '未知省份',
        city: geoData.city || '未知城市',
        district: geoData.district || '',
        latitude: geoData.latitude || 0,
        longitude: geoData.longitude || 0
      };
    }
  } catch (error) {
    console.error('获取访客信息失败:', error);
    // 返回默认值
    return {
      ip: '未知IP',
      province: '未知省份',
      city: '未知城市',
      district: '',
      latitude: 0,
      longitude: 0
    };
  }
}

// 计算两个坐标之间的距离（单位：公里）
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return '未知';
  
  // 将角度转换为弧度
  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const radLon1 = (Math.PI * lon1) / 180;
  const radLon2 = (Math.PI * lon2) / 180;
  
  // 地球半径（单位：公里）
  const earthRadius = 6371;
  
  // Haversine公式计算距离
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return Math.round(distance).toString();
}

// 根据地域返回相应的诗句
function getPoemByRegion(province, city) {
  // 地域诗句映射表
  const regionPoems = {
    // 北京
    '北京': [
      '北京城，古都城，长城内外尽朝晖。',
      '故宫的城墙，天安门的广场，诉说着千年的沧桑。',
      '紫禁城里春光好，长城脚下望京华。'
    ],
    // 上海
    '上海': [
      '黄浦江水起春潮，浦东浦西竞风流。',
      '东方明珠耸云霄，陆家嘴上展新姿。',
      '十里洋场风月阑，魔都夜色醉人眠。'
    ],
    // 广东
    '广东': [
      '羊城八景今犹在，珠江潮涌向南流。',
      '岭南多雨长青树，广府人家尚古风。',
      '红棉花开春色暖，珠江水碧映南天。'
    ],
    // 浙江
    '浙江': [
      '东风渐绿西湖柳，雁已还人未南归。',
      '钱塘江潮声如雷，西子湖畔柳如烟。',
      '山外青山楼外楼，西湖歌舞几时休。'
    ],
    // 江苏
    '江苏': [
      '姑苏城外寒山寺，夜半钟声到客船。',
      '烟花三月下扬州，春风十里扬州路。',
      '春来江水绿如蓝，能不忆江南。'
    ],
    // 四川
    '四川': [
      '蜀道难，难于上青天，侧身西望长咨嗟。',
      '窗含西岭千秋雪，门泊东吴万里船。',
      '锦江春色来天地，玉垒浮云变古今。'
    ],
    // 湖南
    '湖南': [
      '湘江北去，橘子洲头，看万山红遍。',
      '潇湘夜雨涨秋池，芙蓉花开楚天碧。',
      '洞庭天下水，岳阳天下楼。'
    ],
    // 湖北
    '湖北': [
      '黄鹤一去不复返，白云千载空悠悠。',
      '晴川历历汉阳树，芳草萋萋鹦鹉洲。',
      '江汉朝宗汇洞庭，武当山上望长江。'
    ],
    // 河南
    '河南': [
      '中岳嵩山高，黄河水长流。',
      '商都开封千年梦，少林寺里武风扬。',
      '河南之地居中原，华夏文明起源处。'
    ],
    // 河北
    '河北': [
      '燕赵多慷慨悲歌之士，长城内外尽沧桑。',
      '白洋淀上芦花白，狼牙山下松涛鸣。',
      '承德避暑山庄好，北国风光胜江南。'
    ],
    // 山东
    '山东': [
      '泰山天下雄，齐鲁大地宽。',
      '孔子故里尚礼仪，曲阜圣城传薪火。',
      '登东山而小鲁，环海观而自得。'
    ],
    // 山西
    '山西': [
      '黄河入晋疆，太行横峙立。',
      '平遥古城墙，乔家大院深。',
      '壶口瀑布惊天地，云冈石窟述古今。'
    ],
    // 陕西
    '陕西': [
      '秦川自古帝王州，兵马俑前忆秦皇。',
      '西安古城墙，大雁塔高耸，述说着长安的繁华。',
      '华山峰峻险，延安精神传。'
    ],
    // 福建
    '福建': [
      '闽江入海流，武夷山上云。',
      '土楼圆如月，客家情更深。',
      '鼓浪屿上琴声远，厦门海上明月升。'
    ],
    // 云南
    '云南': [
      '苍山洱海两相依，云南风光美如画。',
      '丽江古城水长流，香格里拉是天堂。',
      '高原明珠滇池水，石林奇观冠天下。'
    ],
    // 贵州
    '贵州': [
      '黔山秀水皆入画，贵州多彩民族情。',
      '黄果树下水如瀑，梵净山中云似纱。',
      '贵州山水甲天下，多彩贵州风光好。'
    ],
    // 广西
    '广西': [
      '桂林山水甲天下，阳朔风光美如画。',
      '漓江水碧映青山，壮乡歌声传千里。',
      '龙脊梯田云雾绕，北海银滩浪花白。'
    ],
    // 海南
    '海南': [
      '椰风海韵南国情，天涯海角尽风光。',
      '三亚阳光沙滩美，海口骑楼话沧桑。',
      '热带风情椰林下，碧海蓝天南海边。'
    ],
    // 江西
    '江西': [
      '庐山云雾锁苍穹，鄱阳湖水映晚霞。',
      '滕王阁上望江流，井冈山上红旗扬。',
      '江西物华天宝地，英雄辈出赣鄱乡。'
    ],
    // 安徽
    '安徽': [
      '黄山云海松涛鸣，徽州古韵墨香浓。',
      '新安江水绕徽州，宏村粉墙黛瓦间。',
      '九华山上佛光现，皖南山水入画来。'
    ],
    // 辽宁
    '辽宁': [
      '渤海之滨辽河长，沈阳故宫忆清朝。',
      '大连港口通四海，鞍山钢铁铸辉煌。',
      '辽沈大地春常在，东北风情人难忘。'
    ],
    // 吉林
    '吉林': [
      '长白山巅天池碧，松花江水向东流。',
      '雾凇冰挂银世界，吉林风光冬更美。',
      '北国风光千里雪，吉林松原稻花香。'
    ],
    // 黑龙江
    '黑龙江': [
      '黑土地上稻花香，龙江两岸春意浓。',
      '北国冰雪铸奇观，哈尔滨城如童话。',
      '五大连池火山奇，镜泊湖瀑布壮观。'
    ],
    // 内蒙古
    '内蒙古': [
      '草原辽阔任马驰，蒙古包里话深情。',
      '呼伦贝尔草原美，鄂尔多斯沙漠奇。',
      '敕勒歌声随风远，蓝天白云映草原。'
    ],
    // 宁夏
    '宁夏': [
      '贺兰山下果园成，六盘山上杜鹃红。',
      '黄河几字绕银川，塞上江南风光好。',
      '西夏古都述沧桑，宁夏回乡展新姿。'
    ],
    // 新疆
    '新疆': [
      '天山南北好牧场，帕米尔高原云雾绕。',
      '葡萄美酒夜光杯，新疆歌舞动人心。',
      '塔里木河水向东流，天山雪松傲苍穹。'
    ],
    // 西藏
    '西藏': [
      '雪域高原神圣地，布达拉宫云雾中。',
      '纳木错畔天如镜，珠穆朗玛巅如神。',
      '青藏高原风吹过，雅鲁藏布江水长。'
    ],
    // 青海
    '青海': [
      '青海湖畔草青青，祁连山下牦牛行。',
      '三江源头水长流，昆仑山脉雪皑皑。',
      '塔尔寺里佛光现，青海高原云雾绕。'
    ],
    // 甘肃
    '甘肃': [
      '河西走廊通西域，敦煌莫高窟前古今。',
      '黄河穿兰州，嘉峪关外大漠风。',
      '丝绸古道驼铃响，甘肃风光壮如画。'
    ],
    // 台湾
    '台湾': [
      '宝岛台湾碧海环，阿里山上云雾绕。',
      '日月潭水映青山，台北城中故宫秀。',
      '高山族歌声悠扬，台湾风情醉人心。'
    ],
    // 香港
    '香港': [
      '维多利亚港夜色美，狮子山下话沧桑。',
      '东方之珠耀世界，香江两岸灯如昼。',
      '香港故事几多愁，东方明珠展新姿。'
    ],
    // 澳门
    '澳门': [
      '澳门夜色璀璨明，葡式建筑诉沧桑。',
      '妈祖庙前香火旺，大三巴牌坊立如故。',
      '莲花绽放南海边，东西文化在澳门。'
    ]
  };
  
  // 默认诗句
  const defaultPoems = [
    '海内存知己，天涯若比邻。',
    '莫愁前路无知己，天下谁人不识君。',
    '东风渐绿西湖柳，雁已还人未南归。',
    '海上生明月，天涯共此时。',
    '天南地北，双飞客，老翅几回寒暑。'
  ];
  
  // 根据省份查找诗句
  let poems = [];
  if (province) {
    // 移除"省"、"市"、"自治区"等后缀以便匹配
    const simplifiedProvince = province.replace(/省|市|自治区|特别行政区|维吾尔|回族|壮族|藏族|蒙古族/g, '');
    poems = regionPoems[simplifiedProvince];
  }
  
  // 如果没有找到对应省份的诗句，使用默认诗句
  if (!poems || poems.length === 0) {
    poems = defaultPoems;
  }
  
  // 随机选择一句诗
  const randomIndex = Math.floor(Math.random() * poems.length);
  return poems[randomIndex];
}

// 更新公告栏内容
async function updateAnnouncement() {
  const announcementContent = document.querySelector('.announcement_content');
  if (!announcementContent) return;
  
  // 获取访客信息和服务器信息
  const visitorInfo = await getVisitorInfo();
  const serverIP = await getServerIP();
  const currentTime = getCurrentTime();
  const greeting = getGreeting();
  
  // 服务器位置坐标（杭州）- 实际部署时应该更新为真实服务器位置
  const serverLocation = {
    latitude: 30.2741,
    longitude: 120.1551
  };
  
  // 计算访客与服务器之间的距离
  const distance = calculateDistance(
    visitorInfo.latitude, 
    visitorInfo.longitude, 
    serverLocation.latitude, 
    serverLocation.longitude
  );
  
  // 根据访客地域获取相应的诗句
  const poem = getPoemByRegion(visitorInfo.province, visitorInfo.city);
  
  // 检测当前主题是否为深色模式
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // 根据主题设置不同的样式
  const bgColor = isDarkMode ? '#1a1b27' : '#f0f8ff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const accentColor = '#00c4b6';
  
  // 更新公告栏内容，根据主题使用不同的样式
  announcementContent.innerHTML = `
    <div style="text-align: center; background-color: ${bgColor}; color: ${textColor}; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}; transition: all 0.3s;">
      <div style="margin-bottom: 10px;">
        <span style="font-size: 1.1em;">${isDarkMode ? '🎉 欢迎信息 🎉' : '📢 公告栏 📢'}</span>
      </div>
      <div style="margin-bottom: 5px; font-size: 0.9em;">
        欢迎来自 
        <span style="color: ${accentColor};">${visitorInfo.province} ${visitorInfo.city}</span> 的小伙伴，${greeting}！您现在距离站长约 
        <span style="color: ${accentColor};">${distance}</span> 公里，当前的IP地址为：
        <span style="color: ${accentColor};">${visitorInfo.ip}</span>， ${poem}
        希望本站能为你带来愉快的体验！
      </div>
    </div>
  `;
}

// 监听主题切换事件，当主题变化时更新公告栏
function setupThemeChangeListener() {
  // 创建一个MutationObserver来监听data-theme属性的变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        // 当data-theme属性变化时，更新公告栏
        updateAnnouncement();
      }
    });
  });
  
  // 开始观察document.documentElement的data-theme属性变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  // 初始更新
  updateAnnouncement();
  
  // 设置主题切换监听
  setupThemeChangeListener();
  
  // 每隔一小时更新一次（可以根据需要调整更新频率）
  setInterval(updateAnnouncement, 3600000);
});