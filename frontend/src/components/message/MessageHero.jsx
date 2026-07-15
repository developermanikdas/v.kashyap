const MessageHero = () => {
  return (
    <section className="text-center py-12 px-6">
      <h1 className="font-serif text-5xl leading-tight">
        Secret{" "}
        <span className="bg-gradient-to-r from-violet-500 to-pink-400 bg-clip-text text-transparent">
          Message
        </span>
      </h1>

      <div className="mt-5 h-px w-32 bg-neutral-200 mx-auto relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 text-violet-400">
          ❤
        </div>
      </div>

      <p className="mt-6 text-neutral-500 max-w-sm mx-auto leading-8">
        Three little spaces for honest words,
        meaningful memories,
        and a birthday letter.
      </p>
    </section>
  );
};

export default MessageHero;