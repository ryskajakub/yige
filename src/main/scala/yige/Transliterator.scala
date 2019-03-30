package yige

import io.bdrc.ewtsconverter.EwtsConverter
import yige.Model.Wylie;

object Transliterator {

  val wl = new EwtsConverter();

  def transliterate(w: Wylie): String = {
    wl.toUnicode(w.text)
  }

}
