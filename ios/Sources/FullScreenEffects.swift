import UIKit

// Coin showers and fireworks over the whole iPad screen, Paper included. (The page's own canvas
// only covers the web view, which is just part of the screen while the Paper is open.)
enum FullScreenEffects {
    static func play(_ name: String, in window: UIWindow) {
        let layer = UIView(frame: window.bounds)
        layer.isUserInteractionEnabled = false
        layer.backgroundColor = .clear
        window.addSubview(layer)
        switch name {
        case "fireworks": fireworks(in: layer)
        default: coins(in: layer)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) { layer.removeFromSuperview() }
    }

    // Gold coins raining down from the top edge and spinning.
    private static func coins(in view: UIView) {
        let emitter = CAEmitterLayer()
        emitter.emitterShape = .line
        emitter.emitterPosition = CGPoint(x: view.bounds.midX, y: -30)
        emitter.emitterSize = CGSize(width: view.bounds.width, height: 1)
        let cell = CAEmitterCell()
        cell.contents = coinImage.cgImage
        cell.birthRate = 38
        cell.lifetime = 3.2
        cell.velocity = 180
        cell.velocityRange = 90
        cell.yAcceleration = 820
        cell.emissionLongitude = .pi
        cell.emissionRange = 0.35
        cell.spin = 2.5
        cell.spinRange = 6
        cell.scale = 0.9
        cell.scaleRange = 0.3
        emitter.emitterCells = [cell]
        view.layer.addSublayer(emitter)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.1) { emitter.birthRate = 0 }
    }

    // A few bursts at random spots in the upper part of the screen.
    private static func fireworks(in view: UIView) {
        let colors: [UIColor] = [
            UIColor(red: 1, green: 0.30, blue: 0.30, alpha: 1), UIColor(red: 1, green: 0.82, blue: 0.25, alpha: 1),
            UIColor(red: 0.30, green: 0.82, blue: 1, alpha: 1), UIColor(red: 0.62, green: 0.45, blue: 1, alpha: 1),
            UIColor(red: 0.35, green: 0.9, blue: 0.5, alpha: 1)
        ]
        for i in 0..<6 {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * 0.32) {
                let burst = CAEmitterLayer()
                burst.emitterPosition = CGPoint(x: .random(in: view.bounds.width * 0.15...view.bounds.width * 0.85),
                                                y: .random(in: view.bounds.height * 0.12...view.bounds.height * 0.5))
                burst.emitterShape = .point
                let spark = CAEmitterCell()
                spark.contents = dotImage.cgImage
                spark.color = colors[i % colors.count].cgColor
                spark.birthRate = 2600
                spark.lifetime = 1.3
                spark.lifetimeRange = 0.4
                spark.velocity = 210
                spark.velocityRange = 70
                spark.emissionRange = .pi * 2
                spark.yAcceleration = 140
                spark.alphaSpeed = -0.75
                spark.scale = 0.45
                spark.scaleRange = 0.2
                burst.emitterCells = [spark]
                view.layer.addSublayer(burst)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) { burst.birthRate = 0 }
            }
        }
    }

    // The same coin as the page draws: gold with a rim and a shine.
    private static let coinImage: UIImage = {
        let size = CGSize(width: 28, height: 28)
        return UIGraphicsImageRenderer(size: size).image { ctx in
            let c = ctx.cgContext
            let rect = CGRect(origin: .zero, size: size).insetBy(dx: 1, dy: 1)
            c.setFillColor(UIColor(red: 0.85, green: 0.62, blue: 0.10, alpha: 1).cgColor)
            c.fillEllipse(in: rect)
            c.setFillColor(UIColor(red: 0.98, green: 0.78, blue: 0.22, alpha: 1).cgColor)
            c.fillEllipse(in: rect.insetBy(dx: 3, dy: 3))
            c.setFillColor(UIColor(red: 1, green: 0.93, blue: 0.62, alpha: 0.9).cgColor)
            c.fillEllipse(in: CGRect(x: 8, y: 6, width: 7, height: 5))
        }
    }()

    private static let dotImage: UIImage = {
        UIGraphicsImageRenderer(size: CGSize(width: 10, height: 10)).image { ctx in
            ctx.cgContext.setFillColor(UIColor.white.cgColor)
            ctx.cgContext.fillEllipse(in: CGRect(x: 0, y: 0, width: 10, height: 10))
        }
    }()
}
