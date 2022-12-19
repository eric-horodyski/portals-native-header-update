# Portals for Native Playground

This repository contains a proof-of-concept Capacitor Instance Plugin that allows the web layer to tell the native layer to update it's navigation header.

Capacitor Instance Plugins are used instead of "standard" Capacitor plugins or `PortalPlugin`'s pub/sub mechanism because:

- Capacitor Instance Plugins are programmatically added to Portal instances. "Standard" Capacitor plugins are added to all Portals at application start.
- "Setup" logic can be performed on a Capacitor Instance Plugin before they are registered to Portal instances.
- Unlike the PortalsPlugin pub/sub mechanism, no scaffolding is required to listen and act on communication events between the native and web application layers.

The sections below describe how the Capacitor Instance Plugin works, broken down by layer:

## Capacitor Instance Plugin: Native

The POC contains a Capacitor Instance Plugin (creatively named `NativeHeaderPlugin`) that [initializes with a closure function](https://github.com/eric-horodyski/portals-native-header-update/blob/main/ios/uikit/Portals%20Playground/NativeHeaderPlugin.swift#L8-L11):

```swift
init(onTitleChanged: @escaping (String) -> Void) {
  self.onTitleChanged = onTitleChanged
  super.init()
}
```

When added to a Portal instance, [this closure updates the view's title](https://github.com/eric-horodyski/portals-native-header-update/blob/main/ios/uikit/Portals%20Playground/View%20Controllers/PortalsViewController.swift#L25-L38):

```swift
lazy var nativeHeaderPlugin = NativeHeaderPlugin { [weak self] title in
  DispatchQueue.main.async {
    self?.title = title
  }
}


lazy var portalView: PortalUIView = {
  let portalView = PortalUIView(
    portal: Portal(name: "playground", startDir: "portals/playground")
      .adding(nativeHeaderPlugin)
    )
  return portalView
}()
```

This closure is invoked when the web layer calls the plugin's `setTitle` method:

```swift
@objc func setTitle(_ call: CAPPluginCall) {
  guard let title = call.getString("title") else {
    call.reject("Input option 'title' must be provided.")
    return
  }
  onTitleChanged(title)
  call.resolve()
}
```

## Capacitor Instance Plugin: Web

The TypeScript implementation for the native header plugin can be found [at this link](https://github.com/eric-horodyski/portals-native-header-update/blob/main/web/ionic-angular/src/app/plugins/NativeHeaderPlugin.ts).

The web implementation exists as stub functionality to ensure that, when the app runs in debug mode, the method fires:

```typescript
setTitle(opts: { title: string }): Promise<void> {
  !environment.production &&
    console.log(`Native Header set to: ${opts.title}`);
  return Promise.resolve();
}
```

There are several approaches to calling this function in a cross-cut fashion, including:

- Creating a TypeScript decorator that calls `NativeHeader.setTitle` using a parameter passed in.
- Calling `NativeHeader.setTitle` within `ngOnInit` (especially if the header title should be dynamic).

In order to isolate all calls to this plugin, this POC uses Angular's `TitleStrategy` ([link](https://angular.io/api/router/TitleStrategy)). This strategy would allow one to rip out all reference to the plugin once an application has been converted from Portals to Capacitor.

```typescript
@Injectable()
export class NativeTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title, private userService: UserService) {
    super();
  }

  override async updateTitle(snapshot: RouterStateSnapshot): Promise<void> {
    const title = this.buildTitle(snapshot);
    if (title) return this.setTitle(title);

    switch (true) {
      case snapshot.url.includes("detail"):
        const segments = snapshot.url.split("/");
        return this.setUserDetailTitle(segments[2]);
      default:
        return this.setTitle("Ionic App");
    }
  }

  private async setTitle(title: string) {
    this.title.setTitle(`Ionic App - ${title}`);
    await NativeHeader.setTitle({ title });
  }

  private setUserDetailTitle(uuid: string) {
    let title = "User Detail";
    const user = this.userService.getUserByUuid(uuid);
    user && (title = `${user.name.first} ${user.name.last}`);
    this.setTitle(title);
  }
}
```

Source Code: https://github.com/eric-horodyski/portals-native-header-update/blob/main/web/ionic-angular/src/app/native-title-strategy.service.ts.
