export function generateSplashText(): string {
    const texts = [
        'An unofficial Dead by Daylight study tool!',

        // Study-tool themed
        'Study harder than you loop!',
        'Know every perk before they Hex you!',
        'Now with 100% less tunneling!',
        'Flashcards: your best anti-camp tech.',
        'Memorize it. Then forget it after the next PTB.',
        'Quiz yourself between queue times!',
        'Learn the perks before the patch notes change them!',
        'Knowledge is the best second chance perk.',
        "Read the perk descriptions so you don't have to!",
        'Your brain, now with a Toolbox.',

        // Survivor jokes
        "Don't forget to cleanse your totems!",
        'Pallet? I hardly know her!',
        'Hit the great skill check!',
        "Gens won't do themselves!",
        'Unhook safely, please.',
        'Self-Care is self-love.',
        'T-bag responsibly.',
        'Hold W with confidence.',
        'Brought a flashlight. Forgot how to use it.',
        'The Entity is watching you study.',
        "Three gens in a corner? Couldn't be us.",
        'Hiding in a locker, studying perks.',
        'Adrenaline not included.',

        // Killer jokes
        'Proxy camping your knowledge.',
        'No Ruin? No problem.',
        'Kick the gen. Learn the perk.',
        'Hook them on learning!',
        "Feeling the Nurse's Calling to study.",
        'Hex: Flashcards.',
        'Thrill of the Study.',
        'Stridor can hear you not studying.',
        "You can run, but you can't hide from the quiz.",

        // Meta / community
        'Leave a GG in the chat!',
        'Bloodpoints not included.',
        'Not affiliated with Behaviour Interactive.',
        'Smash the gen, not the keyboard.',
        'Fog-tested, Entity-approved.',
        "Quiz it like it's a 4K.",
        'Survive the quiz with all four escapes!',
        'Endgame Collapse: 2 minutes to finish studying.',
    ];

    const index = Math.floor(Math.random() * texts.length);
    return texts[index];
}
