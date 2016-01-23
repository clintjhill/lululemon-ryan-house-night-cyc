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
  "rpm-spin" => "RPM spin @ 6-7pm",
  "amb-bad-ass" => "Ambassador Bad Asses @ 4-5pm"
}

signup_query = parse_client.query("SignUp")
signup_query.not_eq("spinClass", "")
signup_query.limit = 400
signups = signup_query.get

signups.map do |signup|
  email = signup["email"]
  id = signup.id
  klass = classes[signup["spinClass"]]
  body = "NOTE: All classes are at the Madison Tempe - 149 S. Farmer Ave. Your unique ID is: #{id}. Show this email when you get there."

  mail = SendGrid::Mail.new do |m|
    m.to = email
    m.from = 'signups@nightcyc.com'
    m.subject = "- here's a reminder: #{klass}"
    m.text = body
    m.template = SendGrid::Template.new('00a1db15-0c56-4dc5-bb9d-a1dfbe676ab5')
  end
  mail_client.send(mail)
end
