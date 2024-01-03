---
layout: page.njk
title: 'Stamp: Tutorial'
og_image: '/assets/images/logo-v3.svg'
---

## Stamp tutorial

Let's start with management of personal identities.

The current implementation of Stamp is built in Rust. It consists of two primary
codebases: [Stamp core][core] which
provides a functional API for managing identities and the
[command-line interface][cli], which
allows interacting with the Stamp protocol from the <span class="text-green-900">welcoming comfort</span>
of your favorite terminal.

To get started, turn the computer on. Then [download and build the CLI][cli-get-started].
Good! Now let's start playing with stamp.

First, let's create an identity.

```
$ ./stamp id new
```

The program will guide you to creating your first identity, and once you're done,
it will be added to your local identity storage. Your identity will have three
claims: your identity claim, your name claim, and your email claim. You can view
them like so:

```
$ ./stamp claim list
 ID (short)       | Name | Type     | Value             | Created      | # stamps 
------------------+------+----------+-------------------+--------------+----------
 3TPOHkcINhwLlTqI | -    | identity | zef-qw6W5lh_xC_z  | Apr 24, 2023 | 0 
 Vx9YjwEtVVkUg8Im | -    | name     | Zefram Cochrane   | Apr 24, 2023 | 0 
 HMEmH9gT_5GalMWQ | -    | email    | zef@starfleet.org | Apr 24, 2023 | 0
```

But why settle just for what's given by default? Let's add a claim of our own!

```
$ ./stamp claim new photo /path/to/picture-of-you.jpg
```

Well done, your identity has a photo now. People who know what you look like can
now stamp your photo claim, adding trust to your identity!

Stamp can also handle another type of claim: one that can be verified immediately.
Both the `domain` and `url` claim types support direct
verification. Let's try it out (note that you'll need to be able to write to a
public website to do this).

```
$ ./stamp claim new url
Enter the URL you own: https://news.ycombinator.com/user?id=xX_zefram420_Xx
Claim added. You can finalize this claim and make it verifiable instantly to others by updating the URL
https://news.ycombinator.com/user?id=xX_zefram420_Xx to contain one of the following two values:

  stamp:b97xSSg79_yT2moVe_lx2T_Nf8a1nLRBvA28agnNBZoB
  stamp:b97xSSg79_yT2moV
```

So let's update your HackerNews profile at the URL you entered to contain
`stamp:b97xSSg79_yT2moV`. Done? Now things get spicy:

```
$ ./stamp claim check b97xSSg79_yT2moV

The claim b97xSSg79_yT2moV has been verified!

It is very likely that the identity zef-qw6W5lh_xC_z owns the resource
https://news.ycombinator.com/user?id=xX_zefram420_Xx
```

And just like that, you've proven you own your HackerNews profile.
Notice you don't need a central server to check the validity of the claim
(suck it, Keybase). You can do it from the comfort of your 430 sq ft $5,700/mo
San Francisco apartment.

Ok, we've set up our claims. Now what? How do we actually, you know, <em>Stamp&trade;</em>
things? Let's <a href="{{ site.url }}/assets/zefram.stamp">download Zefram's identity</a> (who I may
later refer to as "Zeph"), generated using <code>./stamp id publish</code>. Now
import it into your local storage.

```
$ ./stamp id import /path/to/zefram.stamp
```

Now that it's in our local storage, let's view the claims on this identity.

```
$ ./stamp claim list --id zef
 ID (short)       | Name | Type     | Value                                                | Created      | # stamps 
------------------+------+----------+------------------------------------------------------+--------------+----------
 3TPOHkcINhwLlTqI | -    | identity | zef-qw6W5lh_xC_z                                     | Apr 24, 2023 | 0 
 Vx9YjwEtVVkUg8Im | -    | name     | Zefram Cochrane                                      | Apr 24, 2023 | 0 
 HMEmH9gT_5GalMWQ | -    | email    | zef@starfleet.org                                    | Apr 24, 2023 | 0 
 0cHvXd7AhQtCg2Vb | -    | photo    | <4008 bytes>                                         | Apr 24, 2023 | 0 
 b97xSSg79_yT2moV | -    | url      | https://news.ycombinator.com/user?id=xX_zefram420_Xx | Apr 24, 2023 | 0 
```

Normally, you'd only stamp a claim if you were actually going to verify it. But
because we're doing a tutorial, let's just pick a claim and *pretend*
you've verified it, which is basically what SSL certificate providers do. We're going
to stamp the `identity` claim.

```
$ ./stamp stamp new 3TPOHkcINhwLlTqI
You are about to stamp the claim 3TPOHkcINhwLlTqI made by the identity zef-qw6W5lh_xC_z.
Effectively, you are vouching for them and that their claim is true. You can specify your confidence in the claim:
    none
        you are not verifying the claim at all, but wish to stamp it anyway
    low
        you have done a quick and dirty verification of the claim
    medium
        you're doing a decent amount of verification, such as having them click a verification link in email
    high
        you have verified the claim extensively (birth certificates, retinal scans, fingerprint matching, etc)
    extreme
        you have known this person for the last 50 years and can be absolutely certain that the claim they are making is correct
        and they are not a hologram or an android imposter

How confident are you in this claim?: low
Would you like your stamp to expire on a certain date? [y/N]: n
Stamp on claim 3TPOHkcINhwLlTqIaheIqCx8m-AonMp3nEGN7FK_YsUB created.
```

Note the lack of fire gifs
<img class="w-3 h-4 inline-block" alt="fire" src="./assets/images/fireanim.gif">
surrounding the "extreme" option. This is a bug and we're working on it. This operation added the
stamp to *our identity*. By default, stamps are saved to the stamper's identity.

Now, if Zefram wants to accept your stamp onto his identity, he can download your identity from
StampNet (coming soon!), or the stamp can be exported and sent directly.
All you need is a way to communicate this stamp to Zeph. But, oh, look at that!
There's an email claim, so you can go ahead and send it to `zefram@starfleet.org`.

Let's export the stamp and email it to Zefram:

```
$ ./stamp stamp list
 ID (short)       | Stampee          | Claim            | Confidence | Created      | Expires 
------------------+------------------+------------------+------------+--------------+---------
 ntjuW2H8MXdQBg5E | zef-qw6W5lh_xC_z | 3TPOHkcINhwLlTqI | low        | Apr 26, 2023 | - 

$ ./stamp stamp export ntjuW2H8MXdQBg5E -b -o -
MIIBYqAmMCShIgQgntjuW2H8MXdQBg5EVgo5Xm9J1HNFwFz_FyBg1XgQesihgcMwgcCgCAIGAYfA_Gfk
oSgwJjAkoSIEICc4IS_Ogq0aLof41W9lBDGCagCMZYROGFMwoZ9nFYsfooGJqoGGMIGDoIGAMH6gJjAk
oSIEILKBfl0WeeMfzfjjjX2f3MTe-y3pjjk29XCzg3ka9T69oSYwJKEiBCDN5_6rDpbmWH_EL_Ncn11f
4AXwjJhC7baR3mhJAhyJLaImMCShIgQg3TPOHkcINhwLlTqIaheIqCx8m-AonMp3nEGN7FK_YsWjBKEC
BQCicjBwoG4wbKAkoCIEIGbHGMajp0m1slISvLeaoC0WKvza8DW6u5vJsN3Uu0L1oUSgQgRAi5-aU1qR
85-JI2y9tv84SU5uvgsTAsNFzXvfiKC5jkqWuzvtMYo3sfhcf1z_Ti-1mGB48lc4VJ6HSr7-QwxHDA
```

On the receiving end, Zephy might do something like this:

```
$ ./stamp stamp accept /path/to/stamp/downloaded/from/email
---
id:
  Blake2b256: ntjuW2H8MXdQBg5EVgo5Xm9J1HNFwFz_FyBg1XgQesg
entry:
  created: "2023-04-27T04:32:59.876Z"
  previous_transactions:
    - Blake2b256: JzghL86CrRouh_jVb2UEMYJqAIxlhE4YUzChn2cVix8
  body:
    MakeStampV1:
      stamp:
        stamper:
          Blake2b256: soF-XRZ54x_N-OONfZ_cxN77LemOOTb1cLODeRr1Pr0
        stampee:
          Blake2b256: zef-qw6W5lh_xC_zXJ9dX-AF8IyYQu22kd5oSQIciS0
        claim_id:
          Blake2b256: 3TPOHkcINhwLlTqIaheIqCx8m-AonMp3nEGN7FK_YsU
        confidence: Low
        expires: ~
signatures:
  - Key:
      key:
        Ed25519: ZscYxqOnSbWyUhK8t5qgLRYq_NrwNbq7m8mw3dS7QvU
      signature:
        Ed25519: i5-aU1qR85-JI2y9tv84SU5uvgsTAsNFzXvfiKC5jkqWuzvtMYo3sfhcf1z_Ti-1mGB48lc4VJ6HSr7-QwxHDA

----------
Do you wish to accept the above stamp? [Y/n]: Y
Stamp ntjuW2H8MXdQBg5EVgo5Xm9J1HNFwFz_FyBg1XgQesgB has been accepted.
```

And the stamp is accepted! Zef thanks you for your trust.

[cli]: https://github.com/stamp-protocol/cli
[cli-get-started]: https://github.com/stamp-protocol/cli#getting-started
[core]: https://github.com/stamp-protocol/core
