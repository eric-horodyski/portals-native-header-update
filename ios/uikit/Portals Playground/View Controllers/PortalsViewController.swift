//
//  PortalsViewController.swift
//  Portals Playground
//
//  Created by Eric Horodyski on 12/14/22.
//

import UIKit
import IonicPortals

extension Portal {
  static let playground = Self(
    name: "playground",
    startDir: "portals/playground"
  )
}

class PortalsViewController: UIViewController {

  override func viewDidLoad() {
    super.viewDidLoad()
    title = "Portals"
    navigationItem.largeTitleDisplayMode = .never
    
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
    
    
    
    portalView.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(portalView)
    NSLayoutConstraint.activate([
        portalView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
        portalView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
        portalView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
        portalView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor)
    ])
  }
  
}
