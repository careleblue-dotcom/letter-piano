# 曲谱 MIDI 来源

这些文件只用于重新生成本地字母谱：

- `fur-elise.mid`：[Mutopia，公版](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931)
- `gymnopedie-1.mid`：[Mutopia，公版](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=37)
- `entertainer.mid`：[Mutopia，公版](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=263)
- `never-see-me-again.mid`：[Online Sequencer 的公开分享序列](https://onlinesequencer.net/3681530)，原序列约 46 秒；项目中的约 2 分 40 秒版本由它重复、延展并简化而成。

转换命令：`npm run songs:generate`。生成器在 `scripts/generate-songs.mjs`。


## 新增轻进阶曲目

- 《旋律》：`schumann-melody.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/SchumannR/O68/schumann-op68-01-melodie/schumann-op68-01-melodie.mid)。
- 《士兵进行曲》：`schumann-soldiers-march.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/SchumannR/O68/schumann-op68-02-marche-militaire/schumann-op68-02-marche-militaire.mid)。
- 《勇敢的骑士》：`schumann-wild-rider.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/SchumannR/O68/schumann-op68-08-cavalier-sauvage/schumann-op68-08-cavalier-sauvage.mid)。
- 《快乐的农夫》：`schumann-happy-farmer.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/SchumannR/O68/schumann-op68-10-gai-laboureur/schumann-op68-10-gai-laboureur.mid)。
- 《初次的悲伤》：`schumann-first-loss.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/SchumannR/O68/schumann-op68-16-premier-chagrin/schumann-op68-16-premier-chagrin.mid)。
- 《G大调小步舞曲》：`petzold-minuet-g.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/BachJS/BWVAnh114/anna-magdalena-04/anna-magdalena-04.mid)。
- 《G小调小步舞曲》：`petzold-minuet-g-minor.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/BachJS/BWVAnh115/anna-magdalena-05/anna-magdalena-05.mid)。
- 《A大调前奏曲》：`chopin-prelude-7.mid`，[Mutopia 原始 MIDI](https://www.mutopiaproject.org/ftp/ChopinFF/O28/Chop-28-7/Chop-28-7.mid)。

舒曼五首 MIDI 由 Philippe Hézaine 制谱，版权 © 2007，采用 [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/)；本项目对这五首的字母谱改编也按 CC BY-SA 2.5 提供。两首小步舞曲由 Allen Garvin 制谱并置于公有领域；肖邦前奏曲由 Magnus Lewis-Smith 制谱，Mutopia 标注为 Public Domain。

新增版本使用完整 MIDI 的乐拍位置，适度放慢速度，移调并压缩到十九个字母键，简化为一条旋律和一条稀疏伴奏，每次最多按两个键。《快乐的农夫》保留低音声部的主题；《勇敢的骑士》在中段切换到低音主题。两首小步舞曲的 MIDI 没有展开反复，按原谱将前后两个 16 小节段落分别演奏两次（AABB）。部分作品本身为短篇，未通过额外循环拉长。
