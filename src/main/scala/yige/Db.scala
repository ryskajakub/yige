package yige

import java.sql.{Connection, DriverManager, PreparedStatement, ResultSet}

import yige.Model.Word

object Db {

  def insertWord(word: Word) = {
    executeUpdate("INSERT INTO word(tibetan, english, chapter) VALUES (?, ?, ?)",
      Seq(
        stringParameter(word.tibetan),
        stringParameter(word.english),
        stringParameter(word.chapter),
      )
    )
  }

  def allWords(): Seq[Word] = {
    executeQuery("SELECT * FROM word", Seq.empty, {(rs: ResultSet) =>
      val tibetan = rs.getString("tibetan")
      val english = rs.getString("english")
      val chapter = rs.getString("chapter")
      Word(tibetan, english, chapter)
    })
  }

  def allWordsFromChapter(chapter: String): Seq[Word] = {
    executeQuery("SELECT * FROM word WHERE chapter = ?", Seq(stringParameter(chapter)), {(rs: ResultSet) =>
      val tibetan = rs.getString("tibetan")
      val english = rs.getString("english")
      Word(tibetan, english, chapter)
    })
  }

  private def execute[A](query: String, parameters: Seq[Parameter], withPreparedStatement: PreparedStatement => A): A = {
    // connect to the database named "mysql" on port 8889 of localhost
    val url = "jdbc:mysql://localhost:3306/yige?useUnicode=yes&characterEncoding=UTF-8"
    val driver = "com.mysql.jdbc.Driver"
    val username = "yige"
    val password = "yige"
    var connection: Connection = null
    var result: Any = null
    try {
      Class.forName(driver)
      connection = DriverManager.getConnection(url, username, password)
      val preparedStatement = connection.prepareStatement(query)
      parameters.zipWithIndex.foreach {
        case (parameter, index) =>
          parameter.statement(preparedStatement, index + 1)
      }
      result = withPreparedStatement(preparedStatement)
    } catch {
      case e: Exception => e.printStackTrace
    }
    connection.close
    result.asInstanceOf[A]
  }

  private def executeQuery[A](query: String, parameters: Seq[Parameter], pick: ResultSet => A): Seq[A] = {
    execute(query, parameters, (ps: PreparedStatement) => {
      val resultSet = ps.executeQuery()
      val buffer = scala.collection.mutable.Buffer.empty[A]
      while (resultSet.next()) {
        buffer += pick(resultSet)
      }
      buffer
    })
  }

  private def executeUpdate(query: String, parameters: Seq[Parameter]): Unit = {
    execute(query, parameters, {
      (ps: PreparedStatement) =>
        ps.executeUpdate()
        ()
    })
  }

  def stringParameter(parameter: String): Parameter = {
    Parameter(
      (ps: PreparedStatement, index: Int) =>
        ps.setString(index, parameter)
    )
  }

  def intParameter(parameter: Int): Parameter = {
    Parameter(
      (ps: PreparedStatement, index: Int) =>
        ps.setInt(index, parameter)
    )
  }

  case class Parameter(statement: (PreparedStatement, Int) => Unit)

}
