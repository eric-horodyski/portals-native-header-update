import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { NativeHeader } from './plugins/NativeHeaderPlugin';
import { UserService } from './user/user.service';

/**
 * MARK: NativeTitleStrategy is a cross-cut approach to use NativeHeaderPlugin.
 */
@Injectable()
export class NativeTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title, private userService: UserService) {
    super();
  }

  override async updateTitle(snapshot: RouterStateSnapshot): Promise<void> {
    const title = this.buildTitle(snapshot);
    if (title) return this.setTitle(title);

    switch (true) {
      case snapshot.url.includes('detail'):
        const segments = snapshot.url.split('/');
        return this.setUserDetailTitle(segments[2]);
      default:
        return this.setTitle('Ionic App');
    }
  }

  private async setTitle(title: string) {
    this.title.setTitle(`Ionic App - ${title}`);
    await NativeHeader.setTitle({ title });
  }

  private setUserDetailTitle(uuid: string) {
    let title = 'User Detail';
    const user = this.userService.getUserByUuid(uuid);
    user && (title = `${user.name.first} ${user.name.last}`);
    this.setTitle(title);
  }
}
