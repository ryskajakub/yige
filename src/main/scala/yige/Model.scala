package yige

object Model {

  case class Word(tibetan: String, english: String, chapter: String)

  case class Wylie(text: String)

  case class Answer(text: Option[String], chapter: Option[String])

}
