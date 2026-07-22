(function installMotivationalQuotes(global) {
  const source = Object.freeze({
    marcus: 'https://www.gutenberg.org/ebooks/2680',
    epictetus: 'https://www.gutenberg.org/ebooks/45109',
    epictetusTeaching: 'https://www.gutenberg.org/ebooks/39855',
    senecaDialogues: 'https://www.gutenberg.org/ebooks/64576',
    senecaLetters: 'https://en.wikisource.org/wiki/Moral_letters_to_Lucilius',
    emersonFirst: 'https://www.gutenberg.org/ebooks/2944',
    emersonEssays: 'https://www.gutenberg.org/ebooks/16643',
    allen: 'https://www.gutenberg.org/ebooks/4507',
    kellerStory: 'https://www.gutenberg.org/ebooks/2397',
    kellerOptimism: 'https://www.afb.org/about-afb/history/helen-keller/books-essays-speeches/optimism-1903',
    rooseveltArena: 'https://www.presidency.ucsb.edu/documents/address-the-sorbonne-paris-france-citizenship-republic',
    rooseveltStrenuous: 'https://en.wikisource.org/wiki/The_Strenuous_Life',
    lincolnReavis: 'https://papersofabrahamlincoln.org/documents/D200867',
    lincolnCooper: 'https://www.abrahamlincolnonline.org/lincoln/speeches/cooper.htm',
    lincolnCongress: 'https://www.abrahamlincolnonline.org/lincoln/speeches/congress.htm',
    franklin1758: 'https://founders.archives.gov/documents/Franklin/01-07-02-0146',
    franklin1736: 'https://founders.archives.gov/documents/Franklin/01-02-02-0019',
    franklin1737: 'https://founders.archives.gov/documents/Franklin/01-02-02-0028',
    franklin1748: 'https://founders.archives.gov/documents/Franklin/01-03-02-0103',
    walden: 'https://www.gutenberg.org/ebooks/205',
    longfellow: 'https://www.poetryfoundation.org/poems/44644/a-psalm-of-life',
    kipling: 'https://www.poetryfoundation.org/poems/46473/if---',
    tennyson: 'https://www.poetryfoundation.org/poems/45392/ulysses',
    henley: 'https://www.poetryfoundation.org/poems/51642/invictus',
    frostWoods: 'https://www.poetryfoundation.org/poems/42891/stopping-by-woods-on-a-snowy-evening',
    frostServant: 'https://www.poetryfoundation.org/poems/44272/a-servant-to-servants',
    measure: 'https://www.folger.edu/explore/shakespeares-works/measure-for-measure/read/',
    romeo: 'https://www.folger.edu/explore/shakespeares-works/romeo-and-juliet/read/',
    hamlet: 'https://www.folger.edu/explore/shakespeares-works/hamlet/read/',
    tao: 'https://www.gutenberg.org/ebooks/216',
    dhammapada: 'https://www.gutenberg.org/ebooks/2017',
    washington: 'https://www.gutenberg.org/ebooks/2376',
    fdr: 'https://www.fdrlibrary.org/first-inaugural-curriculum-hub',
    kingRight: 'https://kinginstitute.stanford.edu/king-papers/documents/address-delivered-freedom-fund-dinner-fifty-third-annual-convention-naacp',
    kingMoving: 'https://kinginstitute.stanford.edu/king-papers/documents/keep-moving-mountain-address-spelman-college-10-april-1960'
  });

  const quote = (id, text, author, quoteSource) => Object.freeze({
    id,
    text,
    author,
    audio: `assets/audio/motivational-quotes/${id}.mp3`,
    source: quoteSource
  });

  const quotes = Object.freeze([
    quote('jobs-dont-lose-faith', "Sometimes life's gonna hit you in the head with a brick. Don't lose faith.", 'Steve Jobs', 'https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says'),
    quote('rowling-rock-bottom', 'Rock bottom became the solid foundation on which I rebuilt my life.', 'J. K. Rowling', 'https://news.harvard.edu/gazette/story/2008/06/text-of-j-k-rowling-speech/'),
    quote('kennedy-because-hard', 'We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard.', 'John F. Kennedy', 'https://www.jfklibrary.org/learn/about-jfk/historic-speeches/address-at-rice-university-on-the-nations-space-effort'),
    quote('rfk-dare-to-fail', 'Only those who dare to fail greatly can ever achieve greatly.', 'Robert F. Kennedy', 'https://www.jfklibrary.org/learn/about-jfk/the-kennedy-family/robert-f-kennedy/robert-f-kennedy-speeches/day-of-affirmation-address-university-of-capetown-june-6-1966'),
    quote('douglass-struggle-progress', 'If there is no struggle, there is no progress.', 'Frederick Douglass', 'https://www.loc.gov/pictures/resource/ppmsca.84280'),
    quote('churchill-never-give-in', 'Never give in, never give in, never, never, never—in nothing, great or small, large or petty—never give in except to convictions of honour and good sense.', 'Winston Churchill', 'https://winstonchurchill.org/resources/speeches/1941-1945-war-leader/never-give-in/'),
    quote('keller-optimism', 'Optimism is the faith that leads to achievement; nothing can be done without hope.', 'Helen Keller', source.kellerOptimism),
    quote('roosevelt-cannot-do', 'You must do the thing you think you cannot do.', 'Eleanor Roosevelt', 'https://estore.archives.gov/roosevelt/product/do-the-thing-you-think-you-cannot-do-magnet'),
    quote('angelou-not-defeated', 'You may encounter many defeats, but you must not be defeated.', 'Maya Angelou', 'https://www.mayaangelou.com/2020/03/04/maya-angelou-newsletter-march-2020/longquote-3/'),
    quote('roosevelt-work-worth-doing', 'Far and away the best prize that life offers is the chance to work hard at work worth doing.', 'Theodore Roosevelt', 'https://www.theodorerooseveltcenter.org/quote/far-and-away-the-best-prize-that-life-offers-is-the-chance-to-work-hard-at-work-worth-doing/'),

    quote('aurelius-right-and-true', 'If it is not right, do not do it; if it is not true, do not say it.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-quality-thoughts', 'The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-best-revenge', 'The best way of avenging yourself is not to become like the wrongdoer.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-last-act', 'Do every act of your life as if it were the last.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-little-needed', 'Very little indeed is necessary for living a happy life.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-present', 'Confine yourself to the present.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-promontory', 'Be like the promontory against which the waves continually break; it stands firm and tames the fury of the water around it.', 'Marcus Aurelius', source.marcus),
    quote('aurelius-fountain-good', 'Look within. Within is the fountain of good, and it will ever bubble up if you will ever dig.', 'Marcus Aurelius', source.marcus),

    quote('epictetus-views-of-things', 'People are disturbed not by things, but by the views which they take of things.', 'Epictetus', source.epictetus),
    quote('epictetus-wish-events', 'Do not demand that events happen as you wish; wish them to happen as they do happen, and your life will be serene.', 'Epictetus', source.epictetus),
    quote('epictetus-appear-foolish', 'If you wish to improve, be content to appear foolish and stupid.', 'Epictetus', source.epictetus),
    quote('epictetus-restored', "Never say of anything, 'I have lost it,' but, 'I have restored it.'", 'Epictetus', source.epictetus),
    quote('epictetus-actor', 'Remember that you are an actor in a drama, playing the part the director assigns you.', 'Epictetus', source.epictetus),
    quote('epictetus-first-say', 'First say to yourself what you would be; and then do what you have to do.', 'Epictetus', source.epictetusTeaching),
    quote('epictetus-not-sudden', 'No great thing is created suddenly.', 'Epictetus', source.epictetusTeaching),
    quote('epictetus-use-your-power', 'Make the best use of what is in your power, and take the rest as it happens.', 'Epictetus', source.epictetusTeaching),

    quote('seneca-waste-time', 'It is not that we have a short space of time, but that we waste much of it.', 'Seneca', source.senecaDialogues),
    quote('seneca-life-long-enough', 'Life is long enough to allow the accomplishment of the very greatest things.', 'Seneca', source.senecaDialogues),
    quote('seneca-act-of-courage', 'Sometimes even to live is an act of courage.', 'Seneca', source.senecaLetters),
    quote('seneca-strengthen-mind', 'Difficulties strengthen the mind, as labour does the body.', 'Seneca', source.senecaDialogues),
    quote('seneca-test-of-gold', 'Fire is the test of gold; misfortune, of brave people.', 'Seneca', source.senecaLetters),
    quote('seneca-brave-free', 'The one who is brave is free.', 'Seneca', source.senecaLetters),
    quote('seneca-begin-to-live', 'Begin at once to live, and count each separate day as a separate life.', 'Seneca', source.senecaLetters),
    quote('seneca-better-company', 'Associate with those who will make a better person of you.', 'Seneca', source.senecaLetters),

    quote('emerson-enthusiasm', 'Nothing great was ever achieved without enthusiasm.', 'Ralph Waldo Emerson', source.emersonFirst),
    quote('emerson-do-the-thing', 'Do the thing, and you will have the power.', 'Ralph Waldo Emerson', source.emersonEssays),
    quote('emerson-self-trust', 'Self-trust is the first secret of success.', 'Ralph Waldo Emerson', source.emersonEssays),
    quote('emerson-wagon-star', 'Hitch your wagon to a star.', 'Ralph Waldo Emerson', source.emersonEssays),
    quote('emerson-pace-of-nature', 'Adopt the pace of nature: her secret is patience.', 'Ralph Waldo Emerson', source.emersonFirst),
    quote('emerson-artist-amateur', 'Every artist was first an amateur.', 'Ralph Waldo Emerson', source.emersonEssays),
    quote('emerson-reward-done', 'The reward of a thing well done is having done it.', 'Ralph Waldo Emerson', source.emersonEssays),
    quote('emerson-most-yourself', 'Make the most of yourself, for that is all there is of you.', 'Ralph Waldo Emerson', source.emersonFirst),

    quote('allen-sum-of-thoughts', 'A person is literally what they think, their character being the complete sum of all their thoughts.', 'James Allen', source.allen),
    quote('allen-improve-yourself', 'People are anxious to improve their circumstances, but are unwilling to improve themselves; they therefore remain bound.', 'James Allen', source.allen),
    quote('allen-continued-effort', 'A noble character is the natural result of continued effort in right thinking.', 'James Allen', source.allen),
    quote('allen-dream-lofty', 'Dream lofty dreams, and as you dream, so shall you become.', 'James Allen', source.allen),
    quote('allen-dominant-aspiration', 'You will become as small as your controlling desire; as great as your dominant aspiration.', 'James Allen', source.allen),
    quote('allen-circumstance-reveals', 'Circumstance does not make the person; it reveals them to themselves.', 'James Allen', source.allen),
    quote('allen-calmness-jewel', 'Calmness of mind is one of the beautiful jewels of wisdom.', 'James Allen', source.allen),
    quote('allen-calmness-power', 'Self-control is strength; right thought is mastery; calmness is power.', 'James Allen', source.allen),

    quote('keller-daring-adventure', 'Life is either a daring adventure or nothing.', 'Helen Keller', source.kellerOptimism),
    quote('keller-overcoming-suffering', 'Although the world is full of suffering, it is full also of the overcoming of it.', 'Helen Keller', source.kellerOptimism),
    quote('keller-stick-to-it', 'We can do anything we want to if we stick to it long enough.', 'Helen Keller', source.kellerStory),
    quote('keller-together', 'Alone we can do so little; together we can do so much.', 'Helen Keller', source.kellerStory),
    quote('keller-character-trials', 'Only through experience of trial and suffering can the soul be strengthened, ambition inspired, and success achieved.', 'Helen Keller', source.kellerOptimism),
    quote('keller-impulse-to-soar', 'One can never consent to creep when one feels an impulse to soar.', 'Helen Keller', source.kellerStory),

    quote('tr-arena-credit', 'The credit belongs to the person who is actually in the arena.', 'Theodore Roosevelt', source.rooseveltArena),
    quote('tr-no-effort-without-error', 'There is no effort without error and shortcoming.', 'Theodore Roosevelt', source.rooseveltArena),
    quote('tr-daring-greatly', 'If they fail, at least they fail while daring greatly.', 'Theodore Roosevelt', source.rooseveltArena),
    quote('tr-dare-mighty-things', 'Far better it is to dare mighty things, to win glorious triumphs, even though checkered by failure.', 'Theodore Roosevelt', source.rooseveltStrenuous),
    quote('tr-strenuous-life', 'I wish to preach, not the doctrine of ignoble ease, but the doctrine of the strenuous life.', 'Theodore Roosevelt', source.rooseveltStrenuous),

    quote('lincoln-resolution-succeed', 'Always bear in mind that your own resolution to succeed is more important than any other one thing.', 'Abraham Lincoln', source.lincolnReavis),
    quote('lincoln-right-makes-might', 'Let us have faith that right makes might, and in that faith, dare to do our duty as we understand it.', 'Abraham Lincoln', source.lincolnCooper),
    quote('lincoln-rise-occasion', 'The occasion is piled high with difficulty, and we must rise with the occasion.', 'Abraham Lincoln', source.lincolnCongress),

    quote('franklin-well-done', 'Well done is better than well said.', 'Benjamin Franklin', source.franklin1737),
    quote('franklin-diligence-luck', 'Diligence is the mother of good luck.', 'Benjamin Franklin', source.franklin1758),
    quote('franklin-lost-time', 'Lost time is never found again.', 'Benjamin Franklin', source.franklin1748),
    quote('franklin-have-patience', 'The one who can have patience can have what they will.', 'Benjamin Franklin', source.franklin1736),
    quote('franklin-little-strokes', 'Little strokes fell great oaks.', 'Benjamin Franklin', source.franklin1758),

    quote('thoreau-dream-direction', "Go confidently in the direction of your dreams. Live the life you've imagined.", 'Henry David Thoreau', source.walden),
    quote('thoreau-different-drummer', 'If a person does not keep pace with their companions, perhaps it is because they hear a different drummer.', 'Henry David Thoreau', source.walden),
    quote('thoreau-simplify', 'Our life is frittered away by detail. Simplify, simplify.', 'Henry David Thoreau', source.walden),
    quote('thoreau-elevate-life', 'I know of no more encouraging fact than the unquestionable ability of a person to elevate their life by a conscious endeavour.', 'Henry David Thoreau', source.walden),
    quote('thoreau-meet-life', 'However mean your life is, meet it and live it; do not shun it and call it hard names.', 'Henry David Thoreau', source.walden),

    quote('longfellow-lives-sublime', 'Lives of great people all remind us we can make our lives sublime.', 'Henry Wadsworth Longfellow', source.longfellow),
    quote('longfellow-up-and-doing', 'Let us, then, be up and doing, with a heart for any fate.', 'Henry Wadsworth Longfellow', source.longfellow),
    quote('longfellow-achieving-pursuing', 'Still achieving, still pursuing, learn to labor and to wait.', 'Henry Wadsworth Longfellow', source.longfellow),
    quote('longfellow-heights-flight', 'The heights by great people reached and kept were not attained by sudden flight.', 'Henry Wadsworth Longfellow', source.longfellow),

    quote('kipling-triumph-disaster', 'If you can meet with Triumph and Disaster and treat those two impostors just the same.', 'Rudyard Kipling', source.kipling),
    quote('kipling-trust-yourself', 'If you can trust yourself when all people doubt you, but make allowance for their doubting too.', 'Rudyard Kipling', source.kipling),
    quote('kipling-unforgiving-minute', "If you can fill the unforgiving minute with sixty seconds' worth of distance run.", 'Rudyard Kipling', source.kipling),
    quote('kipling-heart-nerve-sinew', 'If you can force your heart and nerve and sinew to serve your turn long after they are gone.', 'Rudyard Kipling', source.kipling),

    quote('tennyson-newer-world', "'Tis not too late to seek a newer world.", 'Alfred, Lord Tennyson', source.tennyson),
    quote('tennyson-not-to-yield', 'To strive, to seek, to find, and not to yield.', 'Alfred, Lord Tennyson', source.tennyson),
    quote('henley-bloody-unbowed', 'My head is bloody, but unbowed.', 'William Ernest Henley', source.henley),
    quote('henley-master-fate', 'I am the master of my fate: I am the captain of my soul.', 'William Ernest Henley', source.henley),
    quote('frost-way-through', 'The best way out is always through.', 'Robert Frost', source.frostServant),
    quote('frost-miles-to-go', 'I have promises to keep, and miles to go before I sleep.', 'Robert Frost', source.frostWoods),

    quote('shakespeare-doubts-traitors', 'Our doubts are traitors, and make us lose the good we oft might win, by fearing to attempt.', 'William Shakespeare', source.measure),
    quote('shakespeare-wisely-slow', 'Wisely and slow; they stumble that run fast.', 'William Shakespeare', source.romeo),
    quote('shakespeare-thinking-makes', 'There is nothing either good or bad, but thinking makes it so.', 'William Shakespeare', source.hamlet),

    quote('lao-tzu-single-step', 'A journey of a thousand miles begins with a single step.', 'Lao Tzu', source.tao),
    quote('lao-tzu-conquer-yourself', 'The one who conquers others is strong; the one who conquers themselves is mighty.', 'Lao Tzu', source.tao),
    quote('buddha-result-thought', 'All that we are is the result of what we have thought.', 'Gautama Buddha', source.dhammapada),
    quote('buddha-earnestness-path', 'Earnestness is the path of immortality; thoughtlessness is the path of death.', 'Gautama Buddha', source.dhammapada),

    quote('washington-obstacles-overcome', 'Success is measured not so much by the position reached in life as by the obstacles overcome.', 'Booker T. Washington', source.washington),
    quote('washington-lift-others', 'If you want to lift yourself up, lift up someone else.', 'Booker T. Washington', source.washington),
    quote('fdr-fear-itself', 'The only thing we have to fear is fear itself.', 'Franklin D. Roosevelt', source.fdr),
    quote('king-time-right', 'The time is always right to do right.', 'Martin Luther King Jr.', source.kingRight),
    quote('king-keep-moving', "If you can't fly, run; if you can't run, walk; if you can't walk, crawl; but by all means keep moving.", 'Martin Luther King Jr.', source.kingMoving)
  ]);

  const quoteById = new Map(quotes.map(quote => [quote.id, quote]));

  function shuffledIds(random = Math.random) {
    const ids = quotes.map(quote => quote.id);
    for (let index = ids.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
    }
    return ids;
  }

  function normalizeBagState(value) {
    const remaining = Array.isArray(value?.remaining)
      ? [...new Set(value.remaining.filter(id => quoteById.has(id)))]
      : [];
    return {
      remaining,
      lastId: quoteById.has(value?.lastId) ? value.lastId : null
    };
  }

  function drawQuote(bagState, random = Math.random) {
    if (!bagState.remaining.length) {
      bagState.remaining = shuffledIds(random);
      const nextIndex = bagState.remaining.length - 1;
      if (bagState.remaining[nextIndex] === bagState.lastId && nextIndex > 0) {
        [bagState.remaining[nextIndex], bagState.remaining[0]] = [bagState.remaining[0], bagState.remaining[nextIndex]];
      }
    }
    const id = bagState.remaining.pop();
    bagState.lastId = id;
    return quoteById.get(id);
  }

  global.SISYPHUS_MOTIVATION = Object.freeze({ quotes, drawQuote, normalizeBagState });
})(globalThis);
