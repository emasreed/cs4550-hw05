defmodule Hello.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      guesses: []
    }
  end

  def guess(st, guess) do
    %{ st | guesses: [guess] ++ st.guesses }
  end

  def get_digits(num) do
    digit_4 = rem(num, 10)
    digit_3 = rem(round(num/10), 10)
    digit_2 = rem(round(num/100), 10)
    digit_1 = rem(round(num/1000), 10)
    [digit_1, digit_2, digit_3, digit_4]
  end

  def find_bulls_cows(secret, guess, rest_secret, rest_guess) do
    if length(rest_guess) == 0 do
      [0,0]
    else
      if hd(rest_secret) == hd(rest_guess) do
        [b,c] = find_bulls_cows(secret, guess, tl(rest_secret), tl(rest_guess))
        [1 + b, 0 + c]
      else
        if Enum.member?(secret, hd(rest_guess)) do
          [b,c] = find_bulls_cows(secret, guess, tl(rest_secret), tl(rest_guess))
          [0+ b, 1+ c]
        else
          [b,c] = find_bulls_cows(secret, guess, tl(rest_secret), tl(rest_guess))
          [0 + b,0 + c]
        end
      end
    end
  end

  def view(st) do
    if length(st.guesses) == 0 do
      %{
        word: [0,0],
        guesses: st.guesses,
        results: []
      }
    else
      secret = st.secret
      |> String.graphemes

      guess = hd(st.guesses)
      |> String.graphemes

      %{
        word: find_bulls_cows(secret, guess, secret, guess),
        guesses: st.guesses,
        results: Enum.map(st.guesses, fn x -> find_bulls_cows(secret, String.graphemes(x), secret, String.graphemes(x)) end)
      }
      end




  end

  def random_secret() do
    random_number = Enum.random(1234..9876)
    digit_4 = rem(random_number, 10)
    digit_3 = rem(round(random_number/10), 10)
    digit_2 = rem(round(random_number/100), 10)
    digit_1 = rem(round(random_number/1000), 10)
    digits = [digit_1, digit_2, digit_3, digit_4]
    if length(digits) != length(Enum.uniq(digits)) do
      random_secret()
    else
      IO.puts "Secret:"
      IO.puts Integer.to_string(random_number)
      Integer.to_string(random_number)
    end
  end
end
