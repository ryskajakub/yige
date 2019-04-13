package yige

object Model {

  case class WordTask(english: String, tibetanAnswer: Option[String], remaining: Int, total: Int)

  case class Word(tibetan: String, english: String, chapter: String)

  case class Wylie(text: String)

  case class Answer(text: String)

  case class SelectChapter(chapter: String)

  case class Chapter(name: String)

}
