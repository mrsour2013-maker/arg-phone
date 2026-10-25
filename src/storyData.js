export const storyData = {
  lockScreen: {
    time: '23:42',
    passcode: '0705',
    notification: '苏茜：你终于醒了。机柜标签上写着 0705。',
    backgroundImage: '/images/lockscreen-wallpaper.jpg'
  },
  contacts: [
    { id: 'suxi', name: '苏茜', note: '警告：机器记录已启动', avatar: 'S', online: true },
    { id: 'silin', name: '司林', note: '昨晚的样本还在冰箱里', avatar: 'L', online: false },
    { id: 'lab', name: '实验室', note: '监控备份已同步', avatar: 'E', online: true },
    { id: 'unknown', name: '未命名号码', note: '语音过期 00:42', avatar: 'U', online: false }
  ],
  chats: {
    suxi: [
      { id: 1, sender: 'suxi', text: '你终于回来了。机柜里有一串数字，别把它看成普通密码。' },
      { id: 2, sender: 'me', text: '我看到了。你说的需要很快吗？' },
      { id: 3, sender: 'suxi', text: '很快。0705。别问为什么，先用它解锁。' }
    ],
    silin: [
      { id: 1, sender: 'silin', text: '那些数据被清理��，可硬盘还在。' },
      { id: 2, sender: 'me', text: '你有没有看到任何标签？' },
      { id: 3, sender: 'silin', text: '有。机柜上有 0705。记住它。' }
    ],
    lab: [
      { id: 1, sender: 'lab', text: '系统正在恢复。第三扇门是假的。' },
      { id: 2, sender: 'me', text: '第三扇门？' },
      { id: 3, sender: 'lab', text: '如果你打开了正确的日志，就能看到它们的真实去向。' }
    ],
    unknown: [
      { id: 1, sender: 'unknown', text: '....' },
      { id: 2, sender: 'me', text: '谁在说话？' },
      { id: 3, sender: 'unknown', text: '0705...' }
    ]
  }
};
