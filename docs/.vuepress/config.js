module.exports = {
    title: 'TypeScript4 文档',
    description: 'TypeScript4 最新官方文档翻译',
    base: '/learn-typescript/',
    theme: 'reco',
    port: '8081',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { 
                text: '王磊的TypeScript 博客', 
                items: [
                    { text: 'Github', link: 'https://github.com/wanglei1991' },
                    { text: 'hexo', link: 'https://wang-lei.fit' }
                ]
            }
        ],
	sidebar: [
            {
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                children: [
                    { title: "学前必读", path: "/" }
                ]
            },
            {
              title: "基础学习",
              path: '/handbook/ConditionalTypes',
              collapsable: false, // 不折叠
              children: [
                { title: "条件类型", path: "/handbook/ConditionalTypes" },
                { title: "泛型", path: "/handbook/Generics" }
              ],
            }
          ],
	 subSidebar: 'auto',
    },
    plugins: [
      ["vuepress-plugin-code-copy", true],
      //[
        // "vuepress-plugin-nuggets-style-copy",
       //],
      ['@vuepress-reco/vuepress-plugin-kan-ban-niang',{
        theme: ["blackCat"],
        clean: false,
        info: 'https://github.com/wanglei1991',
        messages: {
          welcome: '',
          home: '心里的花，我想要带你回家',
          theme: '好吧，希望你能喜欢我的其他小伙伴。',
          close: '再见哦'
        }
      }],
      ["sakura", {
        num: 20,  // 默认数量
        show: true, //  是否显示
        zIndex: -1,   // 层级
        img: {
          replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
          httpUrl: '...'     // 绝对路径
        }
        }],
       [
        "@vuepress-reco/vuepress-plugin-bgm-player",
        {
          audios: [
            //本地歌曲
            {
              //名字
              name: "夜空中最亮的星",
              //作者
              artist: "逃跑计划",
              //地址
              url: "/learn-typescript/yekongzhongzuiliangdexing.ogg",
              //封面图片
              cover: "/learn-typescript/yekongzhongzuiliangdexing.jpg",
            },
            //网络歌曲
            {
              //名字
              name: "可能",
              //作者
              artist: "程响",
              //地址
              url: "http://ru84ck8ao.hd-bkt.clouddn.com/keneng.m4a",
              //封面图片
              cover:
                "http://ru84ck8ao.hd-bkt.clouddn.com/keneng.jpg",
            },
          ],
          // 是否默认缩小
          autoShrink: true,
          // 缩小时缩为哪种模式
          shrinkMode: "float",
          // 悬浮窗样式
          floatStyle: { bottom: "30px", "z-index": "999999" },
        },
      ],
     ],
}
