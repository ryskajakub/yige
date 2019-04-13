package yige

import yige.Model._

import scala.util.Random

object Logic {

  var session: Session = null

  def returnWord(word: Word, total: Int, remaining: Int): WordTask = {
    WordTask(
      english = word.english,
      tibetanAnswer = None,
      remaining = remaining,
      total = total,
    )
  }

  def processSelectChapter(selectChapter: SelectChapter): Option[WordTask] = {
    val (firstWord, rest) = randomFromSeq(Db.allWordsFromChapter(selectChapter.chapter))
    val basicTotal = rest.length + 1
    session = new Session(rest, firstWord, basicTotal)
    Some(returnWord(firstWord, basicTotal, basicTotal))
  }

  def processAnswer(answer: Answer): Option[WordTask] = {
    val wordFromAnswer = session.currentWord.copy(tibetan = answer.text)
    if (wordFromAnswer == session.currentWord) {
      newWord()
    } else {
      session = session.copy(
        total = session.total + 2,
        unanswered = session.unanswered ++ Seq(session.currentWord, session.currentWord),
      )
      Some(WordTask(
        english = session.currentWord.english,
        tibetanAnswer = Some(session.currentWord.tibetan),
        total = session.total,
        remaining = session.unanswered.length,
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
      } else {
        None
      }
    result.map(word => returnWord(
      word = word,
      remaining = session.unanswered.length,
      total = session.total,
    ))
  }

  case class Session(unanswered: Seq[Word], currentWord: Word, total: Int)

}
