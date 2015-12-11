require 'rack/ssl'
require 'sinatra'
require 'sinatra/json'
require 'stripe'

if ENV['RACK_ENV'] == 'production'
  use Rack::SSL
end

Stripe.api_key = "sk_test_Abv2iJvMxL9IP9CxPnii4re6"

set :public_folder, './night-cyc-prototype/dist'

get '/' do
  send_file './night-cyc-prototype/dist/index.html'
end

post '/api/donation' do
  begin
    charge = Stripe::Charge.create(
      :amount => params["donation"],
      :currency => "usd",
      :source => params["token"],
      :receipt_email => params["email"],
      :description => "Lululemon Ryan House Night Cyc"
    )
    json( {:status => charge.status, :receipt_number => charge.receipt_number, :paid => charge.paid} )
  rescue Stripe::CardError => e
    json( {:status => e.message} )
  end
end

get '/signup' do
  send_file './night-cyc-prototype/dist/signup.html'
end

get '/sponsors' do
  send_file './night-cyc-prototype/dist/sponsors.html'
end

get '/location' do
  send_file './night-cyc-prototype/dist/location.html'
end

get '/thanks' do
  send_file './night-cyc-prototype/dist/thanks.html'
end

get '/failed' do
  send_file './night-cyc-prototype/dist/failed.html'
end
