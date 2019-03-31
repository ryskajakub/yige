package yige

import yige.Model._

import scala.util.Random

object Logic {

  var session: Session = null

  def returnWord(word: Word, basicFinished: Int, repeatedRemaining: Int, basicTotal: Int): WordTask = {
    WordTask(
      english = word.english,
      tibetanAnswer = None,
      basicFinished = basicFinished,
      repeatedRemaining = repeatedRemaining,
      basicTotal = basicTotal,
    )
  }

  def processSelectChapter(selectChapter: SelectChapter): Option[WordTask] = {
    val Seq(firstWord, rest @  _*) = Random.shuffle(Db.allWordsFromChapter(selectChapter.chapter))
    val basicTotal = rest.length + 1
    session = new Session(rest, firstWord, basicTotal)
    Some(returnWord(firstWord, 1, 0, basicTotal))
  }

  def processAnswer(answer: Answer): Option[WordTask] = {
    val wordFromAnswer = session.currentWord.copy(tibetan = answer.text)
    if (wordFromAnswer == session.currentWord) {
      newWord()
    } else {
      session = session.copy(
        toRepeat = session.toRepeat ++ Seq(session.currentWord, session.currentWord),
      )
      Some(WordTask(
        english = session.currentWord.english,
        tibetanAnswer = Some(session.currentWord.tibetan),
        basicFinished = session.chapterLength - session.unanswered.length,
        repeatedRemaining = session.toRepeat.length,
        basicTotal = session.chapterLength,
      ))
    }
  }

  def randomFromSeq[A](seq: Seq[A]): (A, Seq[A]) = {
    val index = Random.nextInt(seq.length)
    val word = seq.apply(index)
    val rest = seq.patch(index, Nil, 1)
    word -> rest
  }

  def newWord(): Option[WordTask] = {
    val result =
      if (session.unanswered.nonEmpty) {
        val (word, rest) = randomFromSeq(session.unanswered)
        session = session.copy(
          unanswered = rest,
          currentWord = word,
        )
        Some(word)
      } else if(session.toRepeat.nonEmpty) {
        val (word, rest) = randomFromSeq(session.toRepeat)
        session = session.copy(
          toRepeat = rest,
          currentWord = word,
        )
        Some(word)
      } else {
        None
      }
    result.map(w => returnWord(w, session.chapterLength - session.unanswered.length, session.toRepeat.length, session.chapterLength))
  }

  case class Session(unanswered: Seq[Word], currentWord: Word, chapterLength: Int, toRepeat: Seq[Word] = Nil)

}
