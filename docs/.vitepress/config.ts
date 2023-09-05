import { defineConfigWithTheme, defineConfig } from "vitepress";
import type { Config as ThemeConfig } from "@vue/theme";
import { withMermaid } from "vitepress-plugin-mermaid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import algolia from './algolia'
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
      if (a[0] !== "2") return 1;
      return a > b ? -1 : 1;
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
    lang: "zh-CN",
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
        { text: "日语", link: "/japanese/" }
      ],

      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/shengxinjing/fe-advanced-interview",
        },
      ],
      lastUpdatedText: "更新时间",
      editLink: {
        pattern:
          "https://github.com/shengxinjing/fe-advanced-interview/tree/main/docs/:path",
        text: "编辑页面",
      },
      markdown: {
        config(md) {
          // md.use(taskLists)
        },
      },
      algolia,
      sidebar: {
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
                items: getDirctSidebar("japanese/きょうげきとかぶき")
              }
              
            ],
          },
        ],
      },
      footer: {
        message: "兴趣与工作相结合",
        copyright: " Copyright © 京ICP备18000331号-1",
      }
    },
  })
);
