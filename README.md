# 字母钢琴 · Letter Piano

一个只为自己演奏的本地浏览器钢琴。看见字母就按对应键；曲谱会按歌曲 BPM 自行向左移动，漏音或弹错都不会打断音乐时间线。没有评分、Combo 或账号。

## 启动

需要 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

打开终端显示的本地地址，通常是 `http://127.0.0.1:5173/`。检查构建：`npm run build`。类型检查：`npm run typecheck`。

## 演奏

- `Q W E R T` 是低音区，`A S D F G J K L ;` 是原来的主键区，`Y U I O P` 是高音区，共十九个琴键。也可以用鼠标点击屏幕琴键。
- 同时按多个字母弹和弦；长按字母让音继续，松开后自然收尾。
- 按住 `Space` 使用延音踏板，松开后已释放的音自然消散。
- `Enter` 开始或暂停，`Esc` 暂停。开始前有一小节倒计时。
- “自由弹奏”隐藏曲谱，可先熟悉声音和键位。
- 若需要轻微节奏提示，可打开“节奏辅助”；默认关闭。

首次点击“开始演奏”或“自由弹奏”会解锁浏览器音频并预载全部本地钢琴采样。建议戴耳机，且保持浏览器标签页在前台。

## 项目结构

- `src/audio/`：本地钢琴采样映射、多声部播放、自然 release、延音。
- `src/engine/`：以 `AudioContext.currentTime` 为基准的独立歌曲时间轴。
- `src/keyboard/`：独立的电脑键盘与音高映射。
- `src/songs/`：歌曲类型、四首较长曲目的生成数据与三首入门曲。
- `source-midi/`：较长曲目的来源 MIDI；运行 `npm run songs:generate` 可以重新生成 `src/songs/generated.json`。
- `src/components/`：横向字母曲谱、虚拟琴键、控制栏。
- `src/pages/`：界面状态和输入协调。
- `public/samples/`：随项目提供的少量真实钢琴录音。`src/audio/sampleMapping.ts` 定义采样位置；扩展音域时可在这里加入更多音高采样。

## 钢琴采样署名

录音取自 [Salamander Grand Piano](https://github.com/sfzinstruments/SalamanderGrandPiano)，作者 Alexander Holm，依 [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) 授权。这里使用 [Tone.js 托管的 MP3 版本](https://github.com/Tonejs/audio/tree/master/salamander)，选取十一个音高并在浏览器里对邻近音作小幅移调。采样文件均在本地，演奏时不联网。项目代码为独立实现。

## 曲谱来源与简化说明

- 《致爱丽丝》：[Mutopia 公版 MIDI](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931)，保留从头到尾的时间结构，约 2 分 10 秒。
- 《第一号裸体歌舞》：[Mutopia 公版 MIDI](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37)，保留从头到尾的时间结构，约 2 分 21 秒。
- 《演艺人》：[Mutopia 公版 MIDI](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=263)，保留从头到尾的时间结构，约 4 分 13 秒。
- 《Never See Me Again》：基于 [Online Sequencer 公开分享的钢琴序列](https://onlinesequencer.net/3681530) 重新编排成约 2 分 40 秒的私人练习版。原序列只有约 46 秒，因此这首是重复、延展后的钢琴改编，**不是原歌曲逐音逐段的完整转录**。

为了让曲子能在十九个字母键上弹奏，转换时保留原谱的时间和主要旋律，压缩音域、将半音靠近相邻白键，并适当减少伴奏音。这些版本适合跟随字母谱演奏，不能替代原始钢琴谱。
