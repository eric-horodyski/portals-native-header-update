import Foundation
import Capacitor

@objc(NativeHeaderPlugin)
class NativeHeaderPlugin: CAPInstancePlugin {
  let onTitleChanged: (String) -> Void
  
  init(onTitleChanged: @escaping (String) -> Void) {
    self.onTitleChanged = onTitleChanged
    super.init()
  }
  
  @objc func setTitle(_ call: CAPPluginCall) {
    guard let title = call.getString("title") else {
      call.reject("Input option 'title' must be provided.")
      return
    }
    onTitleChanged(title)
    call.resolve()
  }
}
