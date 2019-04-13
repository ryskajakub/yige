package yige

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import yige.Model.{Answer, SelectChapter, Word, Wylie}

import scala.io.StdIn

object Runner extends SprayJsonSupport with App {

    implicit val system = ActorSystem("my-system")
    implicit val materializer = ActorMaterializer()
    // needed for the future flatMap/onComplete in the end
    implicit val executionContext = system.dispatcher

    import Protocol._

    val route =
      path("word") {
        post {
          entity(as[Word]) {
            word =>
              complete {
                Db.insertWord(word)
                StatusCodes.Created
              }
          }
        } ~ get {
          complete {
            Db.allWords()
          }
        }
      } ~ path("transliterate") {
        post {
          entity(as[Wylie]) {
            wylie =>
              complete {
                Transliterator.transliterate(wylie)
              }
          }
        }
      } ~ path("answer") {
        post {
          entity(as[Answer]) {
            answer =>
              complete {
                Logic.processAnswer(answer)
              }
          }
        }
      } ~ path("selectChapter") {
        post {
          entity(as[SelectChapter]) {
            answer =>
              complete {
                Logic.processSelectChapter(answer)
              }
          }
        }
      } ~ path("chapter" ) {
        get {
          complete {
            Db.allChapters()
          }
        }
      }

    val bindingFuture = Http().bindAndHandle(route, "localhost", 8081)

    println(s"Server online at http://localhost:8081/\nPress RETURN to stop...")
    StdIn.readLine() // let it run until user presses return
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
}
