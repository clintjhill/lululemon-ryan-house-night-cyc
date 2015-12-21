require 'rack/ssl'
require 'sinatra'
require 'sinatra/json'
require 'stripe'
require 'sendgrid-ruby'
require 'parse-ruby-client'

mail_client = SendGrid::Client.new(
  api_user: ENV['SENDGRID_USERNAME'],
  api_key: ENV['SENDGRID_PASSWORD']
)

parse_client = Parse.create(
  :application_id => ENV['PARSE_APPID'],
  :api_key => ENV['PARSE_APIKEY']
)

classes = {
  "madison-phoenix" => "The Madison (Phoenix) @ 5-6pm",
  "madison-tempe-1" => "The Madison (Tempe) @ 3-4pm",
  "madison-tempe-2" => "The Madison (Tempe) @ 7-8pm",
  "rpm-spin" => "rpm spin @ 6-7pm",
  "trucycle" => "TruCycle @ 4-5pm"
}

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

get '/thanks/:objectId' do
  signup_query = parse_client.query("SignUp")
  signup_query.eq("objectId", params["objectId"])
  signup = signup_query.get.first

  mail = SendGrid::Mail.new do |m|
    m.to = signup["email"]
    m.from = 'signups@lululemonnightcyc.com'
    m.subject = signup["email"]
    m.text = "Thanks for signing up and donating $#{signup["donationAmountInCents"]/100}! You're scheduled to ride in the #{classes[signup["spinClass"]]} class. You have a special unique id: #{signup.id}."
    m.template = SendGrid::Template.new('00a1db15-0c56-4dc5-bb9d-a1dfbe676ab5')
  end
  mail_client.send(mail)
  send_file './night-cyc-prototype/dist/thanks.html'
end

get '/failed' do
  send_file './night-cyc-prototype/dist/failed.html'
end
