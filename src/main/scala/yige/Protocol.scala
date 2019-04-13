package yige

import spray.json._
import yige.Model._

object Protocol extends DefaultJsonProtocol {
  implicit val WordProtocol = jsonFormat3(Word)
  implicit val WordTaskProtocol = jsonFormat4(WordTask)
  implicit val WylieProtocol = jsonFormat1(Wylie)
  implicit val AnswerProtocol = jsonFormat1(Answer)
  implicit val SelectChapterProtocol = jsonFormat1(SelectChapter)
  implicit val ChapterProtocol = jsonFormat1(Chapter)
}
