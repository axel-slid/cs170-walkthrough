import SwiftUI

// The page's pixel pet, visiting the Paper. The page sends its sprite (the same 16×16 rows and
// colors as renderer/pets.js); the pet lands at the bottom of the sheet, can be dragged around,
// and goes back to the page when it's dragged past the edge it came in from.

struct PaperPetData: Decodable, Equatable {
    let rows: [String]
    let flap: [String]?
    let colors: [String: String]
    let bird: Bool
    let slow: Bool
    let edge: String // "right": the Paper is right of the page (landscape); "bottom": below it
    let at: Double   // where along that edge it was dropped, 0–1
}

struct PaperPetLayer: View {
    let pet: PaperPetData
    let onReturn: (Double) -> Void

    private let size: CGFloat = 64
    @State private var pos = CGPoint(x: -100, y: -100)
    @State private var moving = false // held or in the air: flap if it has wings
    @State private var flapUp = false
    @State private var dragStart: CGPoint?

    var body: some View {
        GeometryReader { geo in
            sprite(flap: moving && flapUp && pet.flap != nil)
                .frame(width: size, height: size)
                .scaleEffect(x: pet.edge == "right" ? 1 : -1) // face into the sheet
                .position(pos)
                .gesture(
                    DragGesture(minimumDistance: 2, coordinateSpace: .named("paperPet"))
                        .onChanged { v in
                            if dragStart == nil { dragStart = pos }
                            moving = true
                            pos = v.location
                        }
                        .onEnded { v in
                            dragStart = nil
                            // Past the edge it came from: back to the page.
                            if pet.edge == "right" ? v.location.x < 6 : v.location.y < 6 {
                                onReturn(pet.edge == "right" ? Double(v.location.y / geo.size.height) : Double(v.location.x / geo.size.width))
                            } else {
                                drop(in: geo.size)
                            }
                        }
                )
                .onAppear {
                    pos = pet.edge == "right"
                        ? CGPoint(x: size / 2 + 4, y: max(size / 2 + 60, geo.size.height * pet.at))
                        : CGPoint(x: min(max(size / 2, geo.size.width * pet.at), geo.size.width - size / 2), y: size / 2 + 60)
                    moving = true
                    drop(in: geo.size)
                }
        }
        .coordinateSpace(name: "paperPet")
        .onReceive(Timer.publish(every: pet.slow ? 0.08 : 0.11, on: .main, in: .common).autoconnect()) { _ in
            if moving { flapUp.toggle() }
        }
    }

    // Down to the bottom of the sheet: birds glide, the rest drop with a little bounce.
    private func drop(in area: CGSize) {
        let floor = area.height - size / 2 - 10
        let dist = max(0, floor - pos.y)
        moving = true
        let duration: Double
        if pet.bird {
            duration = pet.slow ? max(1.0, min(3.2, dist / 150)) : max(0.4, min(1.3, dist / 320))
            withAnimation(.easeOut(duration: duration)) {
                pos.y = floor
                pos.x = min(area.width - size / 2, max(size / 2, pos.x + 50))
            }
        } else {
            duration = 0.9
            withAnimation(.interpolatingSpring(stiffness: 120, damping: 11)) { pos.y = floor }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) { moving = false }
    }

    private func sprite(flap: Bool) -> some View {
        let rows = (flap ? pet.flap : nil) ?? pet.rows
        let colors = pet.colors.compactMapValues(Color.init(hex:))
        return Canvas { ctx, sz in
            let px = sz.width / 16
            for (y, row) in rows.enumerated() {
                for (x, ch) in row.enumerated() {
                    guard let c = colors[String(ch)] else { continue }
                    ctx.fill(Path(CGRect(x: CGFloat(x) * px, y: CGFloat(y) * px, width: px + 0.4, height: px + 0.4)), with: .color(c))
                }
            }
        }
        .shadow(color: .black.opacity(0.18), radius: 0, x: 0, y: 2)
    }
}

extension Color {
    /// "#rrggbb"
    init?(hex: String) {
        let s = hex.hasPrefix("#") ? String(hex.dropFirst()) : hex
        guard s.count == 6, let v = UInt32(s, radix: 16) else { return nil }
        self.init(red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255, blue: Double(v & 0xff) / 255)
    }
}
