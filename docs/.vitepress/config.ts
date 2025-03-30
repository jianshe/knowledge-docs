import { defineConfigWithTheme, defineConfig } from "vitepress";
import type { Config as ThemeConfig } from "@vue/theme";
import { withMermaid } from "vitepress-plugin-mermaid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import algolia from "./algolia";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDirctSidebar(pathname: string) {
  const p = path.resolve(__dirname, "../", pathname);
  if (!fs.existsSync(p)) return [];
  const dirct = fs
    .readdirSync(p)
    .filter((v) => v.endsWith(".md"))
    .sort((a, b) => {
      if (a === "index.md") return 1;
      /**if (a[0] !== "2") return 1;**/
      return a > b ? 1 : -1;
    });
  return dirct.map((dir) => {
    const file = fs.readFileSync(path.resolve(p, dir)).toString();
    let text = dir;
    let lines = file.split("\n");
    const line = lines.shift() as string;
    if (line.startsWith("# ")) {
      text = line.replace("# ", "");
    } else {
      if (line.startsWith("---")) {
        const index = lines.findIndex((v) => v.startsWith("---"));
        lines = lines.slice(index + 1).filter((v) => v);
        if (lines[0].startsWith("# ")) {
          text = lines[0].replace("# ", "");
        }
      }
    }
    return {
      text,
      link: `/${pathname}/${dir.replace(".md", "")}`,
    };
  });
}

const projectSidebar = {
  text: "前端实战进阶",
  collapsible: true,
  collapsed: true,
  items: getDirctSidebar("project"),
};
// export default withMermaid(defineConfig({
export default withMermaid(
  defineConfigWithTheme<ThemeConfig>({
    title: "遇你前端进阶指南",
    description: "遇你前端进阶指南|Vue3|React|Vite|Cli|项目实战",
    locales: {
      root: { label: "简体中文", lang: "" },
    },
    head: [
      [
        "link",
        {
          rel: "alternate icon",
          href: "https://cdn.jsdelivr.net/gh/jianshe/knowledgeAssets@v1.0.1/assets/albert.png",
          type: "image/png",
          sizes: "16x16",
        },
      ],
      [
        "link",
        {
          rel: "stylesheet",
          href: "https://unpkg.com/tailwindcss@2.0.4/dist/tailwind.min.css",
        },
      ],
      [
        "script",
        { src: "https://hm.baidu.com/hm.js?ccf55dfd2764cf3ebf43d6b3c9da9b20" },
      ],
    ],
    themeConfig: {
      logo: "https://cdn.jsdelivr.net/gh/jianshe/knowledgeAssets@v1.0.1/assets/albert.png",
      nav: [
        { text: "面试课", link: "/interview/" },
        { text: "前端学算法", link: "/algorithm/" },
        // { text: "云构建", link: "/cloud-build/" },
        { text: "微服务", link: "/microservices/" },
        { text: "源码漫游记", link: "/source/" },
        { text: "玩转后端", link: "/backend/" },
        { text: "日语", link: "/japanese/" },
      ],
      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/jianshe/knowledge-docs.git",
        },
      ],
      lastUpdatedText: "更新时间",
      markdown: {
        config(md) {
          // md.use(taskLists)
        },
      },
      algolia,
      sidebar: {
        "/interview": [
          {
            text: "javascript",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/javascript"),
          },

          {
            text: "es6",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/es6"),
          },
          {
            text: "css3",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/css3"),
          },
          {
            text: "typescript",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/typescript"),
          },
          {
            text: "vue",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/vue"),
          },
          {
            text: "engineering",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/engineering"),
          },
          {
            text: "http",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/http"),
          },
          {
            text: "code",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/code"),
          },
          {
            text: "element",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("interview/element"),
          },
        ],
        "/cloud-build": [
          {
            text: "help",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("cloud-build/help"),
          },

          {
            text: "info",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("cloud-build/info"),
          },
          {
            text: "install-set",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("cloud-build/install-set"),
          },
          {
            text: "job-user",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("cloud-build/job-user"),
          },
          {
            text: "sdk",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("cloud-build/sdk"),
          }
        ],
        "/vue": [
          {
            text: "玩转Vue3",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("vue"),
          },
        ],
        "/algorithm": [
          {
            text: "单向链表",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/chainTable"),
          },
          {
            text: "队列",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/queue"),
          },
          {
            text: "递归与栈",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/stack"),
          },
          {
            text: "二叉树",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/binaryTree"),
          },
          {
            text: "堆与优先队列",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/heap"),
          },
          {
            text: "快排及相关优化",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("algorithm/quicksort"),
          },
        ],
        "/microservices": [
          {
            text: "项目发布",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("microservices/publish"),
          },
          {
            text: "乾坤",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("microservices/qiankun"),
          },
        ],
        "/source": [
          {
            text: "vue3",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("source/vue3"),
          },
        ],
        "/backend": [
          {
            text: "linux",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("backend/linux"),
          },
          {
            text: "node",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("backend/node"),
          },
          {
            text: "server",
            collapsible: true,
            collapsed: true,
            items: getDirctSidebar("backend/server"),
          },
        ],
        "/japanese": [
          {
            text: "发音篇",
            collapsible: true,
            collapsed: true,
            items: [
              {
                text: "音声",
                items: getDirctSidebar("japanese/おんせい"),
              },
            ],
          },
          {
            text: "语法篇",
            collapsible: true,
            collapsed: true,
            items: [
              {
                text: "新生活",
                items: getDirctSidebar("japanese/しんせいかつ"),
              },
              {
                text: "校园.时间安排",
                items: getDirctSidebar("japanese/キャンパス.スケジュール"),
              },
              {
                text: "日语学习",
                items: getDirctSidebar("japanese/にほんごのべんきょう"),
              },
              {
                text: "高橋の留学生活",
                items: getDirctSidebar("japanese/たかはしのりゅうがくせいかつ"),
              },
              {
                text: "演讲比赛",
                items: getDirctSidebar("japanese/スピーチコンテスト応援"),
              },
              {
                text: "案内",
                items: getDirctSidebar("japanese/あんない"),
              },
              {
                text: "学生生活",
                items: getDirctSidebar("japanese/がくせいせいかつ"),
              },
              {
                text: "買い物",
                items: getDirctSidebar("japanese/かいもの"),
              },
              {
                text: "规则和礼仪",
                items: getDirctSidebar("japanese/ルールとマナー"),
              },
              {
                text: "京劇と歌舞伎",
                items: getDirctSidebar("japanese/きょうげきとかぶき"),
              },
              {
                text: "年末",
                items: getDirctSidebar("japanese/ぼうねんかい"),
              },
            ],
          },
          {
            text: "进阶篇",
            collapsible: true,
            collapsed: true,
            items: [
              {
                text: "春節",
                items: getDirctSidebar("japanese/しゅんせつ"),
              },
              {
                text: "演唱会",
                items: getDirctSidebar("japanese/コンサート"),
              },
              {
                text: "病気",
                items: getDirctSidebar("japanese/びょうき"),
              },
              {
                text:"環境問題",
                items: getDirctSidebar("japanese/かんきょう"),
              },
              {
                text:"遠足",
                items: getDirctSidebar("japanese/えんそく"),
              },
              {
                text:"宝くじ",
                items: getDirctSidebar("japanese/たからくじ"),
              },
              {
                text:"弁論大会",
                items: getDirctSidebar("japanese/べんろんたいかい"),
              }
            ],
          },

        ],
        "/blog": [
          {
            text: "文章",
            collapsible: true,
            collapsed: false,
            items: [{ text: "", items: getDirctSidebar("blog") }],
          },
        ],
      },
      footer: {
        message: "兴趣与工作相结合",
        copyright: " Copyright © 京ICP备18000331号-1",
      },
    },
  })
);
