package yige

import spray.json._
import yige.Model.{Answer, Word, Wylie}

object Protocol extends DefaultJsonProtocol {
  implicit val WordProtocol = jsonFormat3(Word)
  implicit val WylieProtocol = jsonFormat1(Wylie)
  implicit val AnswerProtocol = jsonFormat2(Answer)
}
