// src/utils/badges.ts
// ============================================================
//  成就徽章系统
//  设计原则：
//  - 数据库只存 badge_id + 解锁时间，结构永远不变
//  - 所有徽章配置（规则/图标/文案）只在本文件维护
//  - 新增徽章：只在 BADGES 数组加一条配置即可
//  - check() 函数：前端用于检测"是否应该解锁"，触发后上报后端
// ============================================================

export type BadgeCategory =
    | 'recovery'    // 康复数据改善
    | 'appointment' // 预约治疗
    | 'circle'      // 圈子社区
    | 'checkin'     // 签到打卡
    | 'consult'     // 专家咨询
    | 'ai'          // 妈妈智问
    | 'workout'     // 运动康复
    | 'special'     // 特殊综合成就

export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'diamond'

// ── 用户数据快照（各页面加载后汇总传入）────────────────────
export interface UserData {
    recovery: {
        totalSessions:    number   // 治疗总次数
        waistImprove:     number   // 腰围减少 cm（正=好转）
        leakageImprove:   number   // 漏尿改善等级数
        diastasisImprove: number   // 腹直肌改善等级数
        muscleImprove:    number   // 肌力提升等级数
        allNormal:        boolean  // 全部指标正常
    }
    appointment: {
        total:     number  // 总预约次数
        evaluated: number  // 已评价次数
    }
    circle: {
        postCount:    number
        likeReceived: number
        commentCount: number
    }
    checkin: {
        totalDays:       number
        consecutiveDays: number
    }
    consult: {
        total: number
    }
    ai: {
        totalChats: number
    }
    workout: {
        totalVideos: number
        hasAccess:   boolean
    }
}

// ── 徽章定义 ─────────────────────────────────────────────────
export interface Badge {
    id:           string
    category:     BadgeCategory
    level:        BadgeLevel
    icon:         string
    name:         string
    desc:         string          // 未解锁时显示的条件
    unlockedDesc: string          // 解锁后显示的文案
    check:        (d: UserData) => boolean
}

// ── 样式配置 ─────────────────────────────────────────────────
export const LEVEL_CONFIG: Record<BadgeLevel, {
    bg: string; border: string; text: string; label: string; glow: string; gradient: string
}> = {
    bronze:  {
        bg: '#fdf4ec', border: '#e8c99a', text: '#9a6b3a', label: '铜',
        glow: 'rgba(232,201,154,0.5)', gradient: 'linear-gradient(135deg,#e8c99a,#c8955a)',
    },
    silver:  {
        bg: '#f5f5f7', border: '#b0b8c4', text: '#5a6a7a', label: '银',
        glow: 'rgba(176,184,196,0.5)', gradient: 'linear-gradient(135deg,#c8d0dc,#8898a8)',
    },
    gold:    {
        bg: '#fffbeb', border: '#f7c948', text: '#9a7a10', label: '金',
        glow: 'rgba(247,201,72,0.6)',  gradient: 'linear-gradient(135deg,#f7c948,#e8a020)',
    },
    diamond: {
        bg: '#f0e8ff', border: '#7c5cbf', text: '#5b3fa6', label: '钻石',
        glow: 'rgba(124,92,191,0.6)',  gradient: 'linear-gradient(135deg,#9b7de0,#5b3fa6)',
    },
}

export const CATEGORY_CONFIG: Record<BadgeCategory, { label: string; icon: string; color: string }> = {
    recovery:    { label: '康复成就', icon: '💪', color: '#10b981' },
    appointment: { label: '治疗记录', icon: '🏥', color: '#3b82f6' },
    circle:      { label: '圈子达人', icon: '🌟', color: '#7c5cbf' },
    checkin:     { label: '坚持打卡', icon: '📅', color: '#f97316' },
    consult:     { label: '专家咨询', icon: '👩‍⚕️', color: '#e05c8a' },
    ai:          { label: 'AI智问',   icon: '🤖', color: '#6366f1' },
    workout:     { label: '运动健将', icon: '🏃', color: '#14b8a6' },
    special:     { label: '特别成就', icon: '🏆', color: '#f59e0b' },
}

// ── 徽章列表（新增徽章只需在这里加一条）─────────────────────
export const BADGES: Badge[] = [

    // ─── 康复数据 ─────────────────────────────────────────────
    {
        id: 'recovery_start', category: 'recovery', level: 'bronze',
        icon: '🌱', name: '康复初体验', desc: '完成第1次治疗',
        unlockedDesc: '你迈出了康复最重要的第一步！',
        check: d => d.recovery.totalSessions >= 1,
    },
    {
        id: 'recovery_5', category: 'recovery', level: 'silver',
        icon: '💪', name: '康复坚持者', desc: '累计完成5次治疗',
        unlockedDesc: '坚持就是胜利，继续加油！',
        check: d => d.recovery.totalSessions >= 5,
    },
    {
        id: 'recovery_10', category: 'recovery', level: 'gold',
        icon: '🔥', name: '康复达人', desc: '累计完成10次治疗',
        unlockedDesc: '你已是康复路上的老将！',
        check: d => d.recovery.totalSessions >= 10,
    },
    {
        id: 'recovery_20', category: 'recovery', level: 'diamond',
        icon: '👑', name: '康复之星', desc: '累计完成20次治疗',
        unlockedDesc: '真正的康复冠军！',
        check: d => d.recovery.totalSessions >= 20,
    },
    {
        id: 'waist_3', category: 'recovery', level: 'bronze',
        icon: '📏', name: '初见成效', desc: '腰围减少超过3cm',
        unlockedDesc: '腰围开始改善，效果初显！',
        check: d => d.recovery.waistImprove >= 3,
    },
    {
        id: 'waist_8', category: 'recovery', level: 'gold',
        icon: '✨', name: '曲线回来了', desc: '腰围减少超过8cm',
        unlockedDesc: '惊人的腰围改善，身材回来了！',
        check: d => d.recovery.waistImprove >= 8,
    },
    {
        id: 'leakage_free', category: 'recovery', level: 'gold',
        icon: '🎉', name: '告别漏尿', desc: '漏尿症状完全改善',
        unlockedDesc: '恭喜！彻底告别漏尿困扰！',
        check: d => d.recovery.leakageImprove >= 3,
    },
    {
        id: 'muscle_up', category: 'recovery', level: 'silver',
        icon: '⚡', name: '肌力提升', desc: '盆底肌力提升2个等级',
        unlockedDesc: '盆底肌力显著增强！',
        check: d => d.recovery.muscleImprove >= 2,
    },
    {
        id: 'diastasis_improve', category: 'recovery', level: 'silver',
        icon: '🩹', name: '腹部修复', desc: '腹直肌分离改善2个等级',
        unlockedDesc: '腹部力量恢复中，继续努力！',
        check: d => d.recovery.diastasisImprove >= 2,
    },
    {
        id: 'all_normal', category: 'recovery', level: 'diamond',
        icon: '🌈', name: '全面康复', desc: '所有指标恢复正常',
        unlockedDesc: '恭喜！你实现了全面康复！',
        check: d => d.recovery.allNormal,
    },

    // ─── 预约治疗 ─────────────────────────────────────────────
    {
        id: 'apt_first', category: 'appointment', level: 'bronze',
        icon: '📋', name: '首次预约', desc: '完成第1次服务预约',
        unlockedDesc: '开启你的康复之旅！',
        check: d => d.appointment.total >= 1,
    },
    {
        id: 'apt_5', category: 'appointment', level: 'silver',
        icon: '🗓️', name: '预约常客', desc: '累计预约5次',
        unlockedDesc: '坚持预约，效果更佳！',
        check: d => d.appointment.total >= 5,
    },
    {
        id: 'apt_20', category: 'appointment', level: 'gold',
        icon: '🏅', name: '治疗老将', desc: '累计预约20次',
        unlockedDesc: '你是机构最忠实的会员！',
        check: d => d.appointment.total >= 20,
    },
    {
        id: 'apt_evaluate_3', category: 'appointment', level: 'bronze',
        icon: '⭐', name: '热心评价', desc: '完成3次服务评价',
        unlockedDesc: '你的评价让服务更完善！',
        check: d => d.appointment.evaluated >= 3,
    },
    {
        id: 'apt_evaluate_10', category: 'appointment', level: 'silver',
        icon: '🌟', name: '评价达人', desc: '完成10次服务评价',
        unlockedDesc: '感谢每一次真实反馈！',
        check: d => d.appointment.evaluated >= 10,
    },

    // ─── 圈子社区 ─────────────────────────────────────────────
    {
        id: 'circle_first_post', category: 'circle', level: 'bronze',
        icon: '✏️', name: '初次发帖', desc: '发布第1篇帖子',
        unlockedDesc: '欢迎加入妈妈圈！',
        check: d => d.circle.postCount >= 1,
    },
    {
        id: 'circle_10_posts', category: 'circle', level: 'silver',
        icon: '📝', name: '活跃分享者', desc: '累计发布10篇帖子',
        unlockedDesc: '你的分享温暖了很多妈妈！',
        check: d => d.circle.postCount >= 10,
    },
    {
        id: 'circle_30_posts', category: 'circle', level: 'gold',
        icon: '🎙️', name: '圈子达人', desc: '累计发布30篇帖子',
        unlockedDesc: '你是圈子里的意见领袖！',
        check: d => d.circle.postCount >= 30,
    },
    {
        id: 'circle_liked_10', category: 'circle', level: 'bronze',
        icon: '❤️', name: '受欢迎的人', desc: '帖子累计获赞10次',
        unlockedDesc: '大家都喜欢你的分享！',
        check: d => d.circle.likeReceived >= 10,
    },
    {
        id: 'circle_liked_50', category: 'circle', level: 'silver',
        icon: '💕', name: '人气妈妈', desc: '帖子累计获赞50次',
        unlockedDesc: '你已是圈子里的人气王！',
        check: d => d.circle.likeReceived >= 50,
    },
    {
        id: 'circle_liked_100', category: 'circle', level: 'gold',
        icon: '💖', name: '人气之星', desc: '帖子累计获赞100次',
        unlockedDesc: '你是圈子里当之无愧的明星！',
        check: d => d.circle.likeReceived >= 100,
    },
    {
        id: 'circle_comment_10', category: 'circle', level: 'bronze',
        icon: '💬', name: '热心留言', desc: '累计评论10次',
        unlockedDesc: '积极互动，共建温暖社区！',
        check: d => d.circle.commentCount >= 10,
    },

    // ─── 签到打卡 ─────────────────────────────────────────────
    {
        id: 'checkin_7', category: 'checkin', level: 'bronze',
        icon: '📅', name: '一周打卡', desc: '连续签到7天',
        unlockedDesc: '坚持一周，好习惯养成中！',
        check: d => d.checkin.consecutiveDays >= 7,
    },
    {
        id: 'checkin_30', category: 'checkin', level: 'silver',
        icon: '🗓️', name: '月度坚持', desc: '连续签到30天',
        unlockedDesc: '一个月不间断，意志力满分！',
        check: d => d.checkin.consecutiveDays >= 30,
    },
    {
        id: 'checkin_100', category: 'checkin', level: 'gold',
        icon: '🏅', name: '百日坚持', desc: '累计签到100天',
        unlockedDesc: '百天坚持，你真的很棒！',
        check: d => d.checkin.totalDays >= 100,
    },
    {
        id: 'checkin_365', category: 'checkin', level: 'diamond',
        icon: '👸', name: '365天守护', desc: '累计签到365天',
        unlockedDesc: '整整一年，你是最坚持的妈妈！',
        check: d => d.checkin.totalDays >= 365,
    },

    // ─── 专家咨询 ─────────────────────────────────────────────
    {
        id: 'consult_first', category: 'consult', level: 'bronze',
        icon: '👩‍⚕️', name: '首次咨询', desc: '完成第1次专家咨询',
        unlockedDesc: '专业指导，事半功倍！',
        check: d => d.consult.total >= 1,
    },
    {
        id: 'consult_5', category: 'consult', level: 'silver',
        icon: '🩺', name: '专家好友', desc: '累计咨询5次',
        unlockedDesc: '你已是专家咨询的常客！',
        check: d => d.consult.total >= 5,
    },

    // ─── 妈妈智问 ─────────────────────────────────────────────
    {
        id: 'ai_first', category: 'ai', level: 'bronze',
        icon: '🤖', name: '初识智问', desc: '第1次使用妈妈智问',
        unlockedDesc: 'AI助手随时为你服务！',
        check: d => d.ai.totalChats >= 1,
    },
    {
        id: 'ai_10', category: 'ai', level: 'silver',
        icon: '💡', name: '智慧妈妈', desc: '累计使用妈妈智问10次',
        unlockedDesc: '善用AI，育儿更轻松！',
        check: d => d.ai.totalChats >= 10,
    },
    {
        id: 'ai_50', category: 'ai', level: 'gold',
        icon: '🧠', name: '学习达人', desc: '累计使用妈妈智问50次',
        unlockedDesc: '对健康知识的渴望令人钦佩！',
        check: d => d.ai.totalChats >= 50,
    },

    // ─── 运动康复 ─────────────────────────────────────────────
    {
        id: 'workout_access', category: 'workout', level: 'silver',
        icon: '🎬', name: '开启运动', desc: '购买运动康复视频课程',
        unlockedDesc: '投资健康，永不亏本！',
        check: d => d.workout.hasAccess,
    },
    {
        id: 'workout_5', category: 'workout', level: 'bronze',
        icon: '🏃', name: '运动新手', desc: '观看5个康复视频',
        unlockedDesc: '迈出运动第一步！',
        check: d => d.workout.totalVideos >= 5,
    },
    {
        id: 'workout_20', category: 'workout', level: 'gold',
        icon: '🏆', name: '运动健将', desc: '观看20个康复视频',
        unlockedDesc: '运动已成为你的好习惯！',
        check: d => d.workout.totalVideos >= 20,
    },

    // ─── 特殊成就 ─────────────────────────────────────────────
    {
        id: 'special_explorer', category: 'special', level: 'silver',
        icon: '🗺️', name: '全能探索者', desc: '使用过所有功能模块',
        unlockedDesc: '你已探索了系统的每一个角落！',
        check: d =>
            d.recovery.totalSessions >= 1 &&
            d.appointment.total >= 1 &&
            d.circle.postCount >= 1 &&
            d.checkin.totalDays >= 1 &&
            d.consult.total >= 1 &&
            d.ai.totalChats >= 1 &&
            d.workout.totalVideos >= 1,
    },
    {
        id: 'special_perfect', category: 'special', level: 'diamond',
        icon: '💎', name: '完美妈妈', desc: '解锁20个以上成就',
        unlockedDesc: '你是一凡妈妈系统的传奇！',
        check: d => BADGES.filter(b => b.id !== 'special_perfect' && b.check(d)).length >= 20,
    },
]

// ── 工具函数 ─────────────────────────────────────────────────

/** 检测新解锁的徽章（与已解锁列表对比）*/
export function detectNewBadges(data: UserData, unlockedIds: string[]): Badge[] {
    return BADGES.filter(b => b.check(data) && !unlockedIds.includes(b.id))
}

/** 计算综合康复评分 0-100 */
export function computeRecoveryScore(data: UserData): number {
    const s = [
        Math.min(25, data.recovery.totalSessions * 2.5),  // 治疗次数 25分
        Math.min(20, data.recovery.waistImprove * 2.5),   // 腰围改善 20分
        Math.min(20, data.recovery.leakageImprove * 7),   // 漏尿改善 20分
        Math.min(20, data.recovery.diastasisImprove * 7), // 腹直肌   20分
        Math.min(15, data.recovery.muscleImprove * 5),    // 肌力     15分
    ]
    return Math.min(100, Math.round(s.reduce((a, b) => a + b, 0)))
}

/** 评分等级 */
export function getScoreLevel(score: number) {
    if (score >= 90) return { label: '完美恢复',   color: '#7c5cbf', emoji: '🏆' }
    if (score >= 75) return { label: '恢复优秀',   color: '#10b981', emoji: '🌟' }
    if (score >= 60) return { label: '恢复良好',   color: '#3b82f6', emoji: '💪' }
    if (score >= 40) return { label: '持续改善中', color: '#f97316', emoji: '🌱' }
    return               { label: '刚刚起步',   color: '#aaa',    emoji: '🐣' }
}