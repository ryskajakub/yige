package yige

import yige.Model.{Answer, Word}

import scala.util.Random

object Logic {

  var session: Session = null

  def returnWord(word: Word): Word = {
    word.copy(tibetan = "")
  }

  def processAnswer(answer: Answer): Option[Word] = {
    (answer.text, answer.chapter) match {
      case (None, Some(chapter)) =>
        val Seq(firstWord, rest @  _*) = Db.allWordsFromChapter(chapter)
        session = new Session(rest, firstWord)
        Some(returnWord(firstWord))
      case (Some(answer), None) =>
        val wordFromAnswer = session.currentWord.copy(tibetan = answer)
        if (wordFromAnswer == session.currentWord) {
          newWord()
        } else {
          session.copy(
            toRepeat = session.toRepeat ++ Seq(session.currentWord, session.currentWord),
          )
          newWord()
        }
    }
  }

  def randomFromSeq[A](seq: Seq[A]): (A, Seq[A]) = {
    val index = Random.nextInt(seq.length)
    val word = seq.apply(index)
    val rest = seq.patch(index, Nil, 1)
    word -> rest
  }

  def newWord(): Option[Word] = {
    if (session.unanswered.nonEmpty) {
      val (word, rest) = randomFromSeq(session.unanswered)
      session.copy(
        unanswered = rest,
        currentWord = word,
      )
      Some(word)
    } else if(session.toRepeat.nonEmpty) {
      val (word, rest) = randomFromSeq(session.toRepeat)
      session.copy(
        toRepeat = rest,
        currentWord = word,
      )
      Some(word)
    } else {
      None
    }
  }

  case class Session(unanswered: Seq[Word], currentWord: Word, toRepeat: Seq[Word] = Nil)

}
