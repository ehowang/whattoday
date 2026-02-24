"use client";

import { useMemo } from "react";

type Locale = "en" | "zh";

const dict: Record<string, { en: string; zh: string }> = {
  // Landing page
  "landing.title1": { en: "WHAT TO EAT", zh: "今天吃什么" },
  "landing.title2": { en: "TODAY?", zh: "?" },
  "landing.desc": {
    en: "Can't decide what to eat? Let the slot machine decide for you! Add your favorite foods and spin the reel.",
    zh: "不知道吃什么？让老虎机帮你决定！添加你喜欢的食物，转动转轮。",
  },
  "landing.create": { en: "CREATE NEW LIST", zh: "创建新列表" },
  "landing.creating": { en: "CREATING...", zh: "创建中..." },

  // Slot machine
  "slot.empty1": { en: "ADD SOME FOOD ITEMS", zh: "添加一些食物" },
  "slot.empty2": { en: "TO START SPINNING!", zh: "开始转动吧！" },
  "slot.paytable": { en: "PAYTABLE", zh: "赔率表" },
  "slot.coin": { en: "COIN", zh: "投币" },
  "slot.spin": { en: "SPIN", zh: "转动" },
  "slot.betMax": { en: "BET MAX", zh: "最大下注" },
  "slot.ready": { en: "READY", zh: "就绪" },
  "slot.spinning": { en: "SPIN", zh: "转动中" },

  // Result display
  "result.jackpot": { en: "JACKPOT!!!", zh: "大奖!!!" },
  "result.header": { en: "TODAY YOU EAT:", zh: "今天你吃：" },
  "result.dismiss": { en: "TAP TO SPIN AGAIN", zh: "点击再转一次" },

  // Food drawer
  "drawer.title": { en: "FOOD ITEMS", zh: "食物列表" },
  "drawer.empty": {
    en: "No food items yet. Add some above!",
    zh: "还没有食物，在上方添加一些吧！",
  },

  // Food item form
  "form.placeholder": { en: "Food name", zh: "食物名称" },
  "form.url": { en: "URL", zh: "链接" },
  "form.upload": { en: "Upload", zh: "上传" },
  "form.imagePlaceholder": { en: "Image URL (optional)", zh: "图片链接（可选）" },
  "form.uploading": { en: "Uploading...", zh: "上传中..." },
  "form.add": { en: "ADD FOOD", zh: "添加食物" },

  // Food item card
  "card.yes": { en: "Yes", zh: "是" },
  "card.no": { en: "No", zh: "否" },

  // Client page
  "client.copied": { en: "COPIED!", zh: "已复制！" },
  "client.share": { en: "SHARE 🔗", zh: "分享 🔗" },
  "client.manage": { en: "Manage food items", zh: "管理食物" },

  // Metadata
  "meta.title": {
    en: "What To Eat Today? | Slot Machine Food Picker",
    zh: "今天吃什么？| 老虎机选餐器",
  },
  "meta.desc": {
    en: "Spin the slot machine to decide what to eat! Add your favorite foods and let fate choose.",
    zh: "转动老虎机来决定吃什么！添加你喜欢的食物，让命运来选择。",
  },
};

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.startsWith("zh") ? "zh" : "en";
}

let cachedLocale: Locale | null = null;

export function getLocale(): Locale {
  if (cachedLocale) return cachedLocale;
  cachedLocale = detectLocale();
  return cachedLocale;
}

export function t(key: string): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[getLocale()];
}

export function useLocale() {
  const locale = useMemo(() => getLocale(), []);
  const translate = useMemo(() => (key: string) => {
    const entry = dict[key];
    if (!entry) return key;
    return entry[locale];
  }, [locale]);
  return { locale, t: translate };
}
