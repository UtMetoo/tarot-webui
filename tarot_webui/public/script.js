/**
 * 塔罗牌占卜应用主逻辑
 * 处理用户输入、城市选择、表单提交和结果显示
 */
class TarotApp {
    constructor() {
        // 城市数据 - 包含中国主要城市
        this.cities = this.loadCities();
        // 去重并标准化城市数据（按名称去重）
        this.cities = this.dedupeCities(this.cities);
        
        // 初始化应用
        this.init();
        
        // 绑定事件
        this.bindEvents();
    }

    /**
     * 加载城市数据
     * 返回包含城市名称、拼音和省份的数组
     */
    loadCities() {
        return [
            { name: '北京市', pinyin: 'beijing', province: '北京' },
            { name: '上海市', pinyin: 'shanghai', province: '上海' },
            { name: '广州市', pinyin: 'guangzhou', province: '广东' },
            { name: '深圳市', pinyin: 'shenzhen', province: '广东' },
            { name: '杭州市', pinyin: 'hangzhou', province: '浙江' },
            { name: '南京市', pinyin: 'nanjing', province: '江苏' },
            { name: '苏州市', pinyin: 'suzhou', province: '江苏' },
            { name: '成都市', pinyin: 'chengdu', province: '四川' },
            { name: '重庆市', pinyin: 'chongqing', province: '重庆' },
            { name: '武汉市', pinyin: 'wuhan', province: '湖北' },
            { name: '西安市', pinyin: 'xian', province: '陕西' },
            { name: '天津市', pinyin: 'tianjin', province: '天津' },
            { name: '青岛市', pinyin: 'qingdao', province: '山东' },
            { name: '大连市', pinyin: 'dalian', province: '辽宁' },
            { name: '厦门市', pinyin: 'xiamen', province: '福建' },
            { name: '宁波市', pinyin: 'ningbo', province: '浙江' },
            { name: '无锡市', pinyin: 'wuxi', province: '江苏' },
            { name: '佛山市', pinyin: 'foshan', province: '广东' },
            { name: '东莞市', pinyin: 'dongguan', province: '广东' },
            { name: '长沙市', pinyin: 'changsha', province: '湖南' },
            { name: '郑州市', pinyin: 'zhengzhou', province: '河南' },
            { name: '济南市', pinyin: 'jinan', province: '山东' },
            { name: '福州市', pinyin: 'fuzhou', province: '福建' },
            { name: '泉州市', pinyin: 'quanzhou', province: '福建' },
            { name: '温州市', pinyin: 'wenzhou', province: '浙江' },
            { name: '徐州市', pinyin: 'xuzhou', province: '江苏' },
            { name: '常州市', pinyin: 'changzhou', province: '江苏' },
            { name: '南通市', pinyin: 'nantong', province: '江苏' },
            { name: '扬州市', pinyin: 'yangzhou', province: '江苏' },
            { name: '镇江市', pinyin: 'zhenjiang', province: '江苏' },
            { name: '泰州市', pinyin: 'taizhou', province: '江苏' },
            { name: '盐城市', pinyin: 'yancheng', province: '江苏' },
            { name: '连云港市', pinyin: 'lianyungang', province: '江苏' },
            { name: '宿迁市', pinyin: 'suqian', province: '江苏' },
            { name: '石家庄市', pinyin: 'shijiazhuang', province: '河北' },
            { name: '唐山市', pinyin: 'tangshan', province: '河北' },
            { name: '秦皇岛市', pinyin: 'qinhuangdao', province: '河北' },
            { name: '邯郸市', pinyin: 'handan', province: '河北' },
            { name: '邢台市', pinyin: 'xingtai', province: '河北' },
            { name: '保定市', pinyin: 'baoding', province: '河北' },
            { name: '张家口市', pinyin: 'zhangjiakou', province: '河北' },
            { name: '承德市', pinyin: 'chengde', province: '河北' },
            { name: '沧州市', pinyin: 'cangzhou', province: '河北' },
            { name: '廊坊市', pinyin: 'langfang', province: '河北' },
            { name: '衡水市', pinyin: 'hengshui', province: '河北' },
            { name: '太原市', pinyin: 'taiyuan', province: '山西' },
            { name: '大同市', pinyin: 'datong', province: '山西' },
            { name: '阳泉市', pinyin: 'yangquan', province: '山西' },
            { name: '长治市', pinyin: 'changzhi', province: '山西' },
            { name: '晋城市', pinyin: 'jincheng', province: '山西' },
            { name: '朔州市', pinyin: 'shuozhou', province: '山西' },
            { name: '晋中市', pinyin: 'jinzhong', province: '山西' },
            { name: '运城市', pinyin: 'yuncheng', province: '山西' },
            { name: '忻州市', pinyin: 'xinzhou', province: '山西' },
            { name: '临汾市', pinyin: 'linfen', province: '山西' },
            { name: '吕梁市', pinyin: 'lvliang', province: '山西' },
            { name: '呼和浩特市', pinyin: 'huhehaote', province: '内蒙古' },
            { name: '包头市', pinyin: 'baotou', province: '内蒙古' },
            { name: '乌海市', pinyin: 'wuhai', province: '内蒙古' },
            { name: '赤峰市', pinyin: 'chifeng', province: '内蒙古' },
            { name: '通辽市', pinyin: 'tongliao', province: '内蒙古' },
            { name: '鄂尔多斯市', pinyin: 'eerduosi', province: '内蒙古' },
            { name: '呼伦贝尔市', pinyin: 'hulunbeier', province: '内蒙古' },
            { name: '巴彦淖尔市', pinyin: 'bayannaoer', province: '内蒙古' },
            { name: '乌兰察布市', pinyin: 'wulanchabu', province: '内蒙古' },
            { name: '兴安盟', pinyin: 'xinganmeng', province: '内蒙古' },
            { name: '锡林郭勒盟', pinyin: 'xilinguolemeng', province: '内蒙古' },
            { name: '阿拉善盟', pinyin: 'alashanmeng', province: '内蒙古' },
            { name: '沈阳市', pinyin: 'shenyang', province: '辽宁' },
            { name: '鞍山市', pinyin: 'anshan', province: '辽宁' },
            { name: '抚顺市', pinyin: 'fushun', province: '辽宁' },
            { name: '本溪市', pinyin: 'benxi', province: '辽宁' },
            { name: '丹东市', pinyin: 'dandong', province: '辽宁' },
            { name: '锦州市', pinyin: 'jinzhou', province: '辽宁' },
            { name: '营口市', pinyin: 'yingkou', province: '辽宁' },
            { name: '阜新市', pinyin: 'fuxin', province: '辽宁' },
            { name: '辽阳市', pinyin: 'liaoyang', province: '辽宁' },
            { name: '盘锦市', pinyin: 'panjin', province: '辽宁' },
            { name: '铁岭市', pinyin: 'tieling', province: '辽宁' },
            { name: '朝阳市', pinyin: 'chaoyang', province: '辽宁' },
            { name: '葫芦岛市', pinyin: 'huludao', province: '辽宁' },
            { name: '长春市', pinyin: 'changchun', province: '吉林' },
            { name: '吉林市', pinyin: 'jilin', province: '吉林' },
            { name: '四平市', pinyin: 'siping', province: '吉林' },
            { name: '辽源市', pinyin: 'liaoyuan', province: '吉林' },
            { name: '通化市', pinyin: 'tonghua', province: '吉林' },
            { name: '白山市', pinyin: 'baishan', province: '吉林' },
            { name: '松原市', pinyin: 'songyuan', province: '吉林' },
            { name: '白城市', pinyin: 'baicheng', province: '吉林' },
            { name: '延边朝鲜族自治州', pinyin: 'yanbian', province: '吉林' },
            { name: '哈尔滨市', pinyin: 'haerbin', province: '黑龙江' },
            { name: '齐齐哈尔市', pinyin: 'qiqihaer', province: '黑龙江' },
            { name: '鸡西市', pinyin: 'jixi', province: '黑龙江' },
            { name: '鹤岗市', pinyin: 'hegang', province: '黑龙江' },
            { name: '双鸭山市', pinyin: 'shuangyashan', province: '黑龙江' },
            { name: '大庆市', pinyin: 'daqing', province: '黑龙江' },
            { name: '伊春市', pinyin: 'yichun', province: '黑龙江' },
            { name: '佳木斯市', pinyin: 'jiamusi', province: '黑龙江' },
            { name: '七台河市', pinyin: 'qitaihe', province: '黑龙江' },
            { name: '牡丹江市', pinyin: 'mudanjiang', province: '黑龙江' },
            { name: '黑河市', pinyin: 'heihe', province: '黑龙江' },
            { name: '绥化市', pinyin: 'suihua', province: '黑龙江' },
            { name: '大兴安岭地区', pinyin: 'daxinganling', province: '黑龙江' },
            { name: '合肥市', pinyin: 'hefei', province: '安徽' },
            { name: '芜湖市', pinyin: 'wuhu', province: '安徽' },
            { name: '蚌埠市', pinyin: 'bengbu', province: '安徽' },
            { name: '淮南市', pinyin: 'huainan', province: '安徽' },
            { name: '马鞍山市', pinyin: 'maanshan', province: '安徽' },
            { name: '淮北市', pinyin: 'huaibei', province: '安徽' },
            { name: '铜陵市', pinyin: 'tongling', province: '安徽' },
            { name: '安庆市', pinyin: 'anqing', province: '安徽' },
            { name: '黄山市', pinyin: 'huangshan', province: '安徽' },
            { name: '滁州市', pinyin: 'chuzhou', province: '安徽' },
            { name: '阜阳市', pinyin: 'fuyang', province: '安徽' },
            { name: '宿州市', pinyin: 'suzhou', province: '安徽' },
            { name: '六安市', pinyin: 'liuan', province: '安徽' },
            { name: '亳州市', pinyin: 'bozhou', province: '安徽' },
            { name: '池州市', pinyin: 'chizhou', province: '安徽' },
            { name: '宣城市', pinyin: 'xuancheng', province: '安徽' },
            { name: '南昌市', pinyin: 'nanchang', province: '江西' },
            { name: '景德镇市', pinyin: 'jingdezhen', province: '江西' },
            { name: '萍乡市', pinyin: 'pingxiang', province: '江西' },
            { name: '九江市', pinyin: 'jiujiang', province: '江西' },
            { name: '新余市', pinyin: 'xinyu', province: '江西' },
            { name: '鹰潭市', pinyin: 'yingtan', province: '江西' },
            { name: '赣州市', pinyin: 'ganzhou', province: '江西' },
            { name: '吉安市', pinyin: 'jian', province: '江西' },
            { name: '宜春市', pinyin: 'yichun', province: '江西' },
            { name: '抚州市', pinyin: 'fuzhou', province: '江西' },
            { name: '上饶市', pinyin: 'shangrao', province: '江西' },
            { name: '济南市', pinyin: 'jinan', province: '山东' },
            { name: '青岛市', pinyin: 'qingdao', province: '山东' },
            { name: '淄博市', pinyin: 'zibo', province: '山东' },
            { name: '枣庄市', pinyin: 'zaozhuang', province: '山东' },
            { name: '东营市', pinyin: 'dongying', province: '山东' },
            { name: '烟台市', pinyin: 'yantai', province: '山东' },
            { name: '潍坊市', pinyin: 'weifang', province: '山东' },
            { name: '济宁市', pinyin: 'jining', province: '山东' },
            { name: '泰安市', pinyin: 'taian', province: '山东' },
            { name: '威海市', pinyin: 'weihai', province: '山东' },
            { name: '日照市', pinyin: 'rizhao', province: '山东' },
            { name: '莱芜市', pinyin: 'laiwu', province: '山东' },
            { name: '临沂市', pinyin: 'linyi', province: '山东' },
            { name: '德州市', pinyin: 'dezhou', province: '山东' },
            { name: '聊城市', pinyin: 'liaocheng', province: '山东' },
            { name: '滨州市', pinyin: 'binzhou', province: '山东' },
            { name: '菏泽市', pinyin: 'heze', province: '山东' },
            { name: '郑州市', pinyin: 'zhengzhou', province: '河南' },
            { name: '开封市', pinyin: 'kaifeng', province: '河南' },
            { name: '洛阳市', pinyin: 'luoyang', province: '河南' },
            { name: '平顶山市', pinyin: 'pingdingshan', province: '河南' },
            { name: '安阳市', pinyin: 'anyang', province: '河南' },
            { name: '鹤壁市', pinyin: 'hebi', province: '河南' },
            { name: '新乡市', pinyin: 'xinxiang', province: '河南' },
            { name: '焦作市', pinyin: 'jiaozuo', province: '河南' },
            { name: '濮阳市', pinyin: 'puyang', province: '河南' },
            { name: '许昌市', pinyin: 'xuchang', province: '河南' },
            { name: '漯河市', pinyin: 'luohe', province: '河南' },
            { name: '三门峡市', pinyin: 'sanmenxia', province: '河南' },
            { name: '南阳市', pinyin: 'nanyang', province: '河南' },
            { name: '商丘市', pinyin: 'shangqiu', province: '河南' },
            { name: '信阳市', pinyin: 'xinyang', province: '河南' },
            { name: '周口市', pinyin: 'zhoukou', province: '河南' },
            { name: '驻马店市', pinyin: 'zhumadian', province: '河南' },
            { name: '济源市', pinyin: 'jiyuan', province: '河南' },
            { name: '武汉市', pinyin: 'wuhan', province: '湖北' },
            { name: '黄石市', pinyin: 'huangshi', province: '湖北' },
            { name: '十堰市', pinyin: 'shiyan', province: '湖北' },
            { name: '宜昌市', pinyin: 'yichang', province: '湖北' },
            { name: '襄阳市', pinyin: 'xiangyang', province: '湖北' },
            { name: '鄂州市', pinyin: 'ezhou', province: '湖北' },
            { name: '荆门市', pinyin: 'jingmen', province: '湖北' },
            { name: '孝感市', pinyin: 'xiaogan', province: '湖北' },
            { name: '荆州市', pinyin: 'jingzhou', province: '湖北' },
            { name: '黄冈市', pinyin: 'huanggang', province: '湖北' },
            { name: '咸宁市', pinyin: 'xianning', province: '湖北' },
            { name: '随州市', pinyin: 'suizhou', province: '湖北' },
            { name: '恩施土家族苗族自治州', pinyin: 'enshi', province: '湖北' },
            { name: '仙桃市', pinyin: 'xiantao', province: '湖北' },
            { name: '潜江市', pinyin: 'qianjiang', province: '湖北' },
            { name: '天门市', pinyin: 'tianmen', province: '湖北' },
            { name: '神农架林区', pinyin: 'shennongjia', province: '湖北' },
            { name: '长沙市', pinyin: 'changsha', province: '湖南' },
            { name: '株洲市', pinyin: 'zhuzhou', province: '湖南' },
            { name: '湘潭市', pinyin: 'xiangtan', province: '湖南' },
            { name: '衡阳市', pinyin: 'hengyang', province: '湖南' },
            { name: '邵阳市', pinyin: 'shaoyang', province: '湖南' },
            { name: '岳阳市', pinyin: 'yueyang', province: '湖南' },
            { name: '常德市', pinyin: 'changde', province: '湖南' },
            { name: '张家界市', pinyin: 'zhangjiajie', province: '湖南' },
            { name: '益阳市', pinyin: 'yiyang', province: '湖南' },
            { name: '郴州市', pinyin: 'chenzhou', province: '湖南' },
            { name: '永州市', pinyin: 'yongzhou', province: '湖南' },
            { name: '怀化市', pinyin: 'huaihua', province: '湖南' },
            { name: '娄底市', pinyin: 'loudi', province: '湖南' },
            { name: '湘西土家族苗族自治州', pinyin: 'xiangxi', province: '湖南' },
            { name: '广州市', pinyin: 'guangzhou', province: '广东' },
            { name: '韶关市', pinyin: 'shaoguan', province: '广东' },
            { name: '深圳市', pinyin: 'shenzhen', province: '广东' },
            { name: '珠海市', pinyin: 'zhuhai', province: '广东' },
            { name: '汕头市', pinyin: 'shantou', province: '广东' },
            { name: '佛山市', pinyin: 'foshan', province: '广东' },
            { name: '江门市', pinyin: 'jiangmen', province: '广东' },
            { name: '湛江市', pinyin: 'zhanjiang', province: '广东' },
            { name: '茂名市', pinyin: 'maoming', province: '广东' },
            { name: '肇庆市', pinyin: 'zhaoqing', province: '广东' },
            { name: '惠州市', pinyin: 'huizhou', province: '广东' },
            { name: '梅州市', pinyin: 'meizhou', province: '广东' },
            { name: '汕尾市', pinyin: 'shanwei', province: '广东' },
            { name: '河源市', pinyin: 'heyuan', province: '广东' },
            { name: '阳江市', pinyin: 'yangjiang', province: '广东' },
            { name: '清远市', pinyin: 'qingyuan', province: '广东' },
            { name: '东莞市', pinyin: 'dongguan', province: '广东' },
            { name: '中山市', pinyin: 'zhongshan', province: '广东' },
            { name: '潮州市', pinyin: 'chaozhou', province: '广东' },
            { name: '揭阳市', pinyin: 'jieyang', province: '广东' },
            { name: '云浮市', pinyin: 'yunfu', province: '广东' },
            { name: '南宁市', pinyin: 'nanning', province: '广西' },
            { name: '柳州市', pinyin: 'liuzhou', province: '广西' },
            { name: '桂林市', pinyin: 'guilin', province: '广西' },
            { name: '梧州市', pinyin: 'wuzhou', province: '广西' },
            { name: '北海市', pinyin: 'beihai', province: '广西' },
            { name: '防城港市', pinyin: 'fangchenggang', province: '广西' },
            { name: '钦州市', pinyin: 'qinzhou', province: '广西' },
            { name: '贵港市', pinyin: 'guigang', province: '广西' },
            { name: '玉林市', pinyin: 'yulin', province: '广西' },
            { name: '百色市', pinyin: 'baise', province: '广西' },
            { name: '贺州市', pinyin: 'hezhou', province: '广西' },
            { name: '河池市', pinyin: 'hechi', province: '广西' },
            { name: '来宾市', pinyin: 'laibin', province: '广西' },
            { name: '崇左市', pinyin: 'chongzuo', province: '广西' },
            { name: '海口市', pinyin: 'haikou', province: '海南' },
            { name: '三亚市', pinyin: 'sanya', province: '海南' },
            { name: '三沙市', pinyin: 'sansha', province: '海南' },
            { name: '儋州市', pinyin: 'danzhou', province: '海南' },
            { name: '五指山市', pinyin: 'wuzhishan', province: '海南' },
            { name: '琼海市', pinyin: 'qionghai', province: '海南' },
            { name: '文昌市', pinyin: 'wenchang', province: '海南' },
            { name: '万宁市', pinyin: 'wanning', province: '海南' },
            { name: '东方市', pinyin: 'dongfang', province: '海南' },
            { name: '定安县', pinyin: 'dingan', province: '海南' },
            { name: '屯昌县', pinyin: 'tunchang', province: '海南' },
            { name: '澄迈县', pinyin: 'chengmai', province: '海南' },
            { name: '临高县', pinyin: 'lingao', province: '海南' },
            { name: '白沙黎族自治县', pinyin: 'baisha', province: '海南' },
            { name: '昌江黎族自治县', pinyin: 'changjiang', province: '海南' },
            { name: '乐东黎族自治县', pinyin: 'ledong', province: '海南' },
            { name: '陵水黎族自治县', pinyin: 'lingshui', province: '海南' },
            { name: '保亭黎族苗族自治县', pinyin: 'baoting', province: '海南' },
            { name: '琼中黎族苗族自治县', pinyin: 'qiongzhong', province: '海南' },
            { name: '重庆市', pinyin: 'chongqing', province: '重庆' },
            { name: '成都市', pinyin: 'chengdu', province: '四川' },
            { name: '自贡市', pinyin: 'zigong', province: '四川' },
            { name: '攀枝花市', pinyin: 'panzhihua', province: '四川' },
            { name: '泸州市', pinyin: 'luzhou', province: '四川' },
            { name: '德阳市', pinyin: 'deyang', province: '四川' },
            { name: '绵阳市', pinyin: 'mianyang', province: '四川' },
            { name: '广元市', pinyin: 'guangyuan', province: '四川' },
            { name: '遂宁市', pinyin: 'suining', province: '四川' },
            { name: '内江市', pinyin: 'neijiang', province: '四川' },
            { name: '乐山市', pinyin: 'leshan', province: '四川' },
            { name: '南充市', pinyin: 'nanchong', province: '四川' },
            { name: '眉山市', pinyin: 'meishan', province: '四川' },
            { name: '宜宾市', pinyin: 'yibin', province: '四川' },
            { name: '广安市', pinyin: 'guangan', province: '四川' },
            { name: '达州市', pinyin: 'dazhou', province: '四川' },
            { name: '雅安市', pinyin: 'yaan', province: '四川' },
            { name: '巴中市', pinyin: 'bazhong', province: '四川' },
            { name: '资阳市', pinyin: 'ziyang', province: '四川' },
            { name: '阿坝藏族羌族自治州', pinyin: 'aba', province: '四川' },
            { name: '甘孜藏族自治州', pinyin: 'ganzi', province: '四川' },
            { name: '凉山彝族自治州', pinyin: 'liangshan', province: '四川' },
            { name: '贵阳市', pinyin: 'guiyang', province: '贵州' },
            { name: '六盘水市', pinyin: 'liupanshui', province: '贵州' },
            { name: '遵义市', pinyin: 'zunyi', province: '贵州' },
            { name: '安顺市', pinyin: 'anshun', province: '贵州' },
            { name: '毕节市', pinyin: 'bijie', province: '贵州' },
            { name: '铜仁市', pinyin: 'tongren', province: '贵州' },
            { name: '黔西南布依族苗族自治州', pinyin: 'qianxinan', province: '贵州' },
            { name: '黔东南苗族侗族自治州', pinyin: 'qiandongnan', province: '贵州' },
            { name: '黔南布依族苗族自治州', pinyin: 'qiannan', province: '贵州' },
            { name: '昆明市', pinyin: 'kunming', province: '云南' },
            { name: '曲靖市', pinyin: 'qujing', province: '云南' },
            { name: '玉溪市', pinyin: 'yuxi', province: '云南' },
            { name: '保山市', pinyin: 'baoshan', province: '云南' },
            { name: '昭通市', pinyin: 'zhaotong', province: '云南' },
            { name: '丽江市', pinyin: 'lijiang', province: '云南' },
            { name: '普洱市', pinyin: 'puer', province: '云南' },
            { name: '临沧市', pinyin: 'lincang', province: '云南' },
            { name: '楚雄彝族自治州', pinyin: 'chuxiong', province: '云南' },
            { name: '红河哈尼族彝族自治州', pinyin: 'honghe', province: '云南' },
            { name: '文山壮族苗族自治州', pinyin: 'wenshan', province: '云南' },
            { name: '西双版纳傣族自治州', pinyin: 'xishuangbanna', province: '云南' },
            { name: '大理白族自治州', pinyin: 'dali', province: '云南' },
            { name: '德宏傣族景颇族自治州', pinyin: 'dehong', province: '云南' },
            { name: '怒江傈僳族自治州', pinyin: 'nujiang', province: '云南' },
            { name: '迪庆藏族自治州', pinyin: 'diqing', province: '云南' },
            { name: '拉萨市', pinyin: 'lasa', province: '西藏' },
            { name: '日喀则市', pinyin: 'rikaze', province: '西藏' },
            { name: '昌都市', pinyin: 'changdu', province: '西藏' },
            { name: '林芝市', pinyin: 'linzhi', province: '西藏' },
            { name: '山南市', pinyin: 'shannan', province: '西藏' },
            { name: '那曲市', pinyin: 'naqu', province: '西藏' },
            { name: '阿里地区', pinyin: 'ali', province: '西藏' },
            { name: '西安市', pinyin: 'xian', province: '陕西' },
            { name: '铜川市', pinyin: 'tongchuan', province: '陕西' },
            { name: '宝鸡市', pinyin: 'baoji', province: '陕西' },
            { name: '咸阳市', pinyin: 'xianyang', province: '陕西' },
            { name: '渭南市', pinyin: 'weinan', province: '陕西' },
            { name: '延安市', pinyin: 'yanan', province: '陕西' },
            { name: '汉中市', pinyin: 'hanzhong', province: '陕西' },
            { name: '榆林市', pinyin: 'yulin', province: '陕西' },
            { name: '安康市', pinyin: 'ankang', province: '陕西' },
            { name: '商洛市', pinyin: 'shangluo', province: '陕西' },
            { name: '兰州市', pinyin: 'lanzhou', province: '甘肃' },
            { name: '嘉峪关市', pinyin: 'jiayuguan', province: '甘肃' },
            { name: '金昌市', pinyin: 'jinchang', province: '甘肃' },
            { name: '白银市', pinyin: 'baiyin', province: '甘肃' },
            { name: '天水市', pinyin: 'tianshui', province: '甘肃' },
            { name: '武威市', pinyin: 'wuwei', province: '甘肃' },
            { name: '张掖市', pinyin: 'zhangye', province: '甘肃' },
            { name: '平凉市', pinyin: 'pingliang', province: '甘肃' },
            { name: '酒泉市', pinyin: 'jiuquan', province: '甘肃' },
            { name: '庆阳市', pinyin: 'qingyang', province: '甘肃' },
            { name: '定西市', pinyin: 'dingxi', province: '甘肃' },
            { name: '陇南市', pinyin: 'longnan', province: '甘肃' },
            { name: '临夏回族自治州', pinyin: 'linxia', province: '甘肃' },
            { name: '甘南藏族自治州', pinyin: 'gannan', province: '甘肃' },
            { name: '西宁市', pinyin: 'xining', province: '青海' },
            { name: '海东市', pinyin: 'haidong', province: '青海' },
            { name: '海北藏族自治州', pinyin: 'haibei', province: '青海' },
            { name: '黄南藏族自治州', pinyin: 'huangnan', province: '青海' },
            { name: '海南藏族自治州', pinyin: 'hainan', province: '青海' },
            { name: '果洛藏族自治州', pinyin: 'guoluo', province: '青海' },
            { name: '玉树藏族自治州', pinyin: 'yushu', province: '青海' },
            { name: '海西蒙古族藏族自治州', pinyin: 'haixi', province: '青海' },
            { name: '银川市', pinyin: 'yinchuan', province: '宁夏' },
            { name: '石嘴山市', pinyin: 'shizuishan', province: '宁夏' },
            { name: '吴忠市', pinyin: 'wuzhong', province: '宁夏' },
            { name: '固原市', pinyin: 'guyuan', province: '宁夏' },
            { name: '中卫市', pinyin: 'zhongwei', province: '宁夏' },
            { name: '乌鲁木齐市', pinyin: 'wulumuqi', province: '新疆' },
            { name: '克拉玛依市', pinyin: 'kelamayi', province: '新疆' },
            { name: '吐鲁番市', pinyin: 'tulufan', province: '新疆' },
            { name: '哈密市', pinyin: 'hami', province: '新疆' },
            { name: '昌吉回族自治州', pinyin: 'changji', province: '新疆' },
            { name: '博尔塔拉蒙古自治州', pinyin: 'boertala', province: '新疆' },
            { name: '巴音郭楞蒙古自治州', pinyin: 'bayinguoleng', province: '新疆' },
            { name: '阿克苏地区', pinyin: 'akesu', province: '新疆' },
            { name: '克孜勒苏柯尔克孜自治州', pinyin: 'kezilesu', province: '新疆' },
            { name: '喀什地区', pinyin: 'kashi', province: '新疆' },
            { name: '和田地区', pinyin: 'hetian', province: '新疆' },
            { name: '伊犁哈萨克自治州', pinyin: 'yili', province: '新疆' },
            { name: '塔城地区', pinyin: 'tacheng', province: '新疆' },
            { name: '阿勒泰地区', pinyin: 'aletai', province: '新疆' },
            { name: '石河子市', pinyin: 'shihezi', province: '新疆' },
            { name: '阿拉尔市', pinyin: 'alaer', province: '新疆' },
            { name: '图木舒克市', pinyin: 'tumushuke', province: '新疆' },
            { name: '五家渠市', pinyin: 'wujiaqu', province: '新疆' },
            { name: '北屯市', pinyin: 'beitun', province: '新疆' },
            { name: '铁门关市', pinyin: 'tiemenguan', province: '新疆' },
            { name: '双河市', pinyin: 'shuanghe', province: '新疆' },
            { name: '可克达拉市', pinyin: 'kekedala', province: '新疆' },
            { name: '昆玉市', pinyin: 'kunyu', province: '新疆' },
            { name: '胡杨河市', pinyin: 'huyanghe', province: '新疆' },
            { name: '新星市', pinyin: 'xinxing', province: '新疆' },
            { name: '白杨市', pinyin: 'baiyang', province: '新疆' }
        ];
    }

    /**
     * 去重城市数据（按名称）
     */
    dedupeCities(cities) {
        const nameToCity = new Map();
        for (const city of cities) {
            if (!nameToCity.has(city.name)) {
                nameToCity.set(city.name, city);
            }
        }
        return Array.from(nameToCity.values());
    }

    /**
     * 初始化应用
     */
    init() {
        // 设置当前日期为默认生日
        const today = new Date();
        const birthdayInput = document.getElementById('birthday');
        if (birthdayInput) {
            // 设置为25年前的今天作为默认生日
            const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
            birthdayInput.value = defaultDate.toISOString().split('T')[0];
        }

        // 初始化城市选择器
        this.initCitySelector();
        
        // 隐藏加载状态和结果区域
        this.hideElement('loadingState');
        this.hideElement('resultArea');

        // 初始 ARIA 状态
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'false');
        const citySearch = document.getElementById('citySearch');
        if (citySearch) citySearch.setAttribute('aria-expanded', 'false');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('tarotForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // 城市搜索事件
        const citySearch = document.getElementById('citySearch');
        if (citySearch) {
            citySearch.addEventListener('input', (e) => this.handleCitySearch(e));
            citySearch.addEventListener('focus', () => this.showCityDropdown());
            citySearch.addEventListener('blur', () => {
                // 延迟隐藏，确保点击事件能正常触发
                setTimeout(() => this.hideCityDropdown(), 200);
            });
        }

        // 点击页面其他地方隐藏城市下拉框
        document.addEventListener('click', (e) => {
            const citySelector = document.querySelector('.city-selector');
            if (citySelector && !citySelector.contains(e.target)) {
                this.hideCityDropdown();
            }
        });
    }

    /**
     * 初始化城市选择器
     */
    initCitySelector() {
        const dropdown = document.getElementById('cityDropdown');
        if (!dropdown) return;

        // 显示热门城市
        this.showPopularCities();

        // 语义化
        dropdown.setAttribute('role', 'listbox');
    }

    /**
     * 显示热门城市
     */
    showPopularCities() {
        const popularCities = [
            '北京市', '上海市', '广州市', '深圳市', '杭州市', 
            '南京市', '苏州市', '成都市', '重庆市', '武汉市',
            '西安市', '天津市', '青岛市', '大连市', '厦门市'
        ];

        const dropdown = document.getElementById('cityDropdown');
        if (!dropdown) return;

        dropdown.innerHTML = '';
        
        // 添加提示标题
        const header = document.createElement('div');
        header.className = 'city-option-header';
        header.innerHTML = '<strong>热门城市</strong>';
        header.style.cssText = 'padding: 10px 15px; background: #f8f9ff; font-size: 12px; color: #667eea; border-bottom: 1px solid #eee;';
        dropdown.appendChild(header);

        // 添加热门城市选项
        popularCities.forEach(cityName => {
            const city = this.cities.find(c => c.name === cityName);
            if (city) {
                this.createCityOption(city, dropdown);
            }
        });
    }

    /**
     * 处理城市搜索
     */
    handleCitySearch(event) {
        const query = event.target.value.toLowerCase().trim();
        const dropdown = document.getElementById('cityDropdown');
        
        if (!dropdown) return;

        if (query === '') {
            this.showPopularCities();
            return;
        }

        // 搜索匹配的城市
        const matchedCities = this.cities.filter(city => 
            city.name.toLowerCase().includes(query) ||
            city.pinyin.toLowerCase().includes(query) ||
            city.province.toLowerCase().includes(query)
        ).slice(0, 10); // 限制显示10个结果

        dropdown.innerHTML = '';

        if (matchedCities.length === 0) {
            const noResult = document.createElement('div');
            noResult.className = 'city-option';
            noResult.innerHTML = '未找到匹配的城市';
            noResult.style.color = '#999';
            noResult.style.cursor = 'default';
            dropdown.appendChild(noResult);
        } else {
            matchedCities.forEach(city => {
                this.createCityOption(city, dropdown);
            });
        }

        this.showCityDropdown();
    }

    /**
     * 创建城市选项元素
     */
    createCityOption(city, container) {
        const option = document.createElement('div');
        option.className = 'city-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.innerHTML = `
            <span>${city.name}</span>
            <span class="city-province">${city.province}</span>
        `;
        
        option.addEventListener('click', () => {
            this.selectCity(city);
        });
        
        container.appendChild(option);
    }

    /**
     * 选择城市
     */
    selectCity(city) {
        const citySearch = document.getElementById('citySearch');
        if (citySearch) {
            citySearch.value = city.name;
            citySearch.dataset.selectedCity = city.name;
        }
        // 更新选中态
        const dropdown = document.getElementById('cityDropdown');
        if (dropdown) {
            const options = dropdown.querySelectorAll('[role="option"]');
            options.forEach(el => el.setAttribute('aria-selected', 'false'));
            const match = Array.from(options).find(el => el.textContent.trim().startsWith(city.name));
            if (match) match.setAttribute('aria-selected', 'true');
        }
        this.hideCityDropdown();
    }

    /**
     * 显示城市下拉框
     */
    showCityDropdown() {
        const dropdown = document.getElementById('cityDropdown');
        if (dropdown) {
            dropdown.classList.add('show');
        }
        const citySearch = document.getElementById('citySearch');
        if (citySearch) citySearch.setAttribute('aria-expanded', 'true');
    }

    /**
     * 隐藏城市下拉框
     */
    hideCityDropdown() {
        const dropdown = document.getElementById('cityDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        const citySearch = document.getElementById('citySearch');
        if (citySearch) citySearch.setAttribute('aria-expanded', 'false');
    }

    /**
     * 处理表单提交
     */
    async handleSubmit(event) {
        event.preventDefault();

        // 收集表单数据
        const formData = this.collectFormData();
        
        // 验证表单数据
        if (!this.validateFormData(formData)) {
            return;
        }

        // 显示加载状态
        this.showLoading();

        try {
            // 调用API
            await this.callTarotAPI(formData);
        } catch (error) {
            console.error('塔罗牌占卜错误:', error);
            this.showError('占卜过程中出现错误，请稍后重试');
        }
    }

    /**
     * 收集表单数据
     */
    collectFormData() {
        const birthday = document.getElementById('birthday').value;
        const birthtime = document.getElementById('birthtime').value;
        const genderSelect = document.getElementById('genderSelect');
        const gender = genderSelect ? genderSelect.value : '';
        const city = document.getElementById('citySearch').value;
        const question = document.getElementById('question').value;

        // 合并日期和时间
        const birthdayDateTime = `${birthday} ${birthtime}`;

        return {
            birthday: birthdayDateTime,
            gender,
            city,
            question
        };
    }

    /**
     * 验证表单数据
     */
    validateFormData(data) {
        if (!data.birthday || !data.gender || !data.city || !data.question) {
            this.showError('请填写所有必需信息');
            return false;
        }

        if (data.question.length < 5) {
            this.showError('问题描述过于简短，请详细描述您想要占卜的问题');
            return false;
        }

        // 验证城市是否在列表中
        const cityExists = this.cities.some(city => city.name === data.city);
        if (!cityExists) {
            this.showError('请从下拉列表中选择一个有效的城市');
            return false;
        }

        return true;
    }

    /**
     * 调用塔罗牌API
     */
    async callTarotAPI(formData) {
        try {
            console.log('发送API请求:', { ...formData, question: formData.question.substring(0, 50) + '...' });
            
            const response = await fetch('/api/tarot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('API响应状态:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                    if (errorData.details) {
                        console.error('错误详情:', errorData.details);
                    }
                } catch (e) {
                    // 忽略JSON解析错误
                }
                throw new Error(errorMessage);
            }

            // 处理流式响应
            await this.handleStreamResponse(response);

        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    }

    /**
     * 处理流式响应
     */
    async handleStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let cardInfo = '';
        let analysisInfo = '';
        let hasAnyData = false;

        // 显示结果区域
        this.showResult();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                console.log('收到数据块:', chunk.substring(0, 100) + '...');
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            console.log('解析数据:', data);
                            
                            if (data.content) {
                                hasAnyData = true;
                                
                                // 检查是否有错误信息
                                if (data.error) {
                                    console.error('服务器返回错误:', data.error);
                                    throw new Error(data.error);
                                }
                                
                                // 根据节点标题判断内容类型
                                if (data.node_title === '塔罗卡片展示') {
                                    cardInfo = data.content;
                                    this.updateCardInfo(cardInfo);
                                } else if (data.node_title === 'End') {
                                    // 解析End节点的JSON内容
                                    try {
                                        const endData = JSON.parse(data.content);
                                        analysisInfo = endData.output || data.content;
                                        this.updateAnalysisInfo(analysisInfo);
                                    } catch (e) {
                                        analysisInfo = data.content;
                                        this.updateAnalysisInfo(analysisInfo);
                                    }
                                } else if (!data.node_title) {
                                    // 如果没有节点标题，直接作为分析内容处理
                                    analysisInfo = data.content;
                                    this.updateAnalysisInfo(analysisInfo);
                                }
                            }
                        } catch (e) {
                            console.log('跳过无效JSON行:', line, e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
            this.hideLoading();
        }

        if (!hasAnyData) {
            throw new Error('未收到任何有效数据，请检查API配置');
        }
        
        if (!cardInfo && !analysisInfo) {
            throw new Error('占卜结果格式异常，请稍后重试');
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        this.hideElement('resultArea');
        this.showElement('loadingState');
        
        // 禁用提交按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'true');
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        this.hideElement('loadingState');
        
        // 启用提交按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        const loading = document.getElementById('loadingState');
        if (loading) loading.setAttribute('aria-busy', 'false');
    }

    /**
     * 显示结果
     */
    showResult() {
        this.showElement('resultArea');
    }

    /**
     * 更新卡片信息显示
     */
    updateCardInfo(content) {
        const cardArea = document.getElementById('cardArea');
        if (cardArea) {
            try {
                // 尝试解析JSON格式的卡片信息
                const cards = JSON.parse(content);
                if (Array.isArray(cards)) {
                    const cardsHTML = cards.map(card => `
                        <div class="card-item">
                            <div class="card-image">
                                <img src="${card.url}" alt="${card.name_cn}" onerror="this.style.display='none'">
                            </div>
                            <div class="card-info">
                                <h4>${card.name_cn}</h4>
                                <p class="card-name-en">${card.name_en}</p>
                                <p class="card-position">位置 ${card.position} - ${card.type}</p>
                            </div>
                        </div>
                    `).join('');
                    
                    cardArea.innerHTML = `
                        <div class="cards-container">
                            ${cardsHTML}
                        </div>
                    `;
                } else {
                    cardArea.innerHTML = `<div class="card-content">${content}</div>`;
                }
            } catch (e) {
                // 如果不是JSON格式，直接显示内容
                cardArea.innerHTML = `<div class="card-content">${content}</div>`;
            }
        }
    }

    /**
     * 更新解析信息显示
     */
    updateAnalysisInfo(content) {
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
            // 将换行符转换为HTML换行
            const formattedContent = content.replace(/\n/g, '<br>');
            resultArea.innerHTML = `
                <div class="tarot-result">
                    <div class="result-content">${formattedContent}</div>
                </div>
            `;
            this.showElement('resultArea');
        }
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="error-message">
                    <h3>❌ 出现错误</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">重新开始</button>
                </div>
            `;
            this.showElement('resultArea');
        }
        this.hideLoading();
    }

    /**
     * 显示元素
     */
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /**
     * 隐藏元素
     */
    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TarotApp();
});

// 添加一些额外的CSS样式到页面
const additionalStyles = `
<style>
.city-option-header {
    padding: 10px 15px;
    background: #f8f9ff;
    font-size: 12px;
    color: var(--brand-color);
    border-bottom: 1px solid #eee;
    font-weight: 600;
}

.tarot-result {
    text-align: left;
}

.tarot-result h3 {
    color: var(--brand-color);
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
}

.result-content {
    line-height: 1.8;
    font-size: 16px;
    color: #333;
    white-space: pre-wrap;
}

.error-message {
    text-align: center;
    padding: 30px;
}

.error-message h3 {
    color: #e74c3c;
    margin-bottom: 15px;
}

.error-message p {
    color: #666;
    margin-bottom: 20px;
    font-size: 16px;
}

.retry-btn {
    background: var(--brand-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.retry-btn:hover {
    background: #5a6fd8;
}

/* 卡片显示样式 */
.cards-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.card-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: #fafbfc;
}

.card-image {
    flex-shrink: 0;
    width: 60px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-info {
    flex: 1;
}

.card-info h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #2b2f36;
}

.card-name-en {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #6b7280;
    font-style: italic;
}

.card-position {
    margin: 0;
    font-size: 14px;
    color: var(--brand-color);
    font-weight: 500;
}

.card-content {
    color: #2b2f36;
    line-height: 1.6;
}

/* 优化移动端显示 */
@media (max-width: 768px) {
    .result-content {
        font-size: 14px;
    }
    
    .tarot-result h3 {
        font-size: 1.3rem;
    }
    
    .card-item {
        flex-direction: column;
        text-align: center;
    }
    
    .card-image {
        width: 80px;
        height: 100px;
    }
}
</style>
`;

// 将额外样式添加到页面头部
document.head.insertAdjacentHTML('beforeend', additionalStyles);