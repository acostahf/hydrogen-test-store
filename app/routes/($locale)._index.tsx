import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type V2_MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import TextBlock from '~/components/TextBlock';
import {Card, CardFooter, Tooltip} from '@nextui-org/react';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <FeaturedCollection collection={data.featuredCollection} />
      <TextBlock>We are a leading clothing brand.</TextBlock>
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  const image = collection.image;
  return (
    <div className="flex md:flex-row flex-col w-full md:h-auto">
      <div className="md:w-1/2 h-96 md:h-auto flex flex-col justify-center items-start px-6 md:px-12">
        <h1 className="m-0 mb-2 text-4xl lg:text-8xl">
          Mock.shop | {collection.title}
        </h1>
        <p className="text-xl">
          Explore the top of the line tops for your fall collection.
        </p>
      </div>

      <div className="md:w-1/2 relative z-10">
        <div className="absolute top-0 w-full h-full bg-black/20 hover:bg-black/0"></div>
        <Link to={`/collections/${collection.handle}`}>
          {image && (
            <div className="">
              <Image
                className=""
                data={image}
                sizes="(min-width: 45em) 40vw, 100vw"
              />
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="md:h-3/4">
      <div className="p-6 md:p-12">
        <h2 className="text-4xl md:text-5xl">Recommended Products</h2>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="md:px-12 md:pb-12 relative">
              <div className="flex md:flex-row flex-col gap-2 items-center md:justify-between ">
                {products.nodes.map((product) => (
                  <Tooltip
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          {product.title}
                        </div>
                        <div className="text-tiny">
                          <Money data={product.priceRange.minVariantPrice} />
                        </div>
                      </div>
                    }
                  >
                    <Card className="">
                      <Link
                        key={product.id}
                        className="md:w-full"
                        to={`/products/${product.handle}`}
                      >
                        <Image
                          data={product.images.nodes[0]}
                          aspectRatio="1/1"
                          sizes="(min-width: 45em) 20vw, 50vw"
                          className="hover:opacity-60 transition-opacity duration-150"
                        />
                        {/* <CardFooter className="flex flex-col px-6 flex-wrap ">
                        <h4>{product.title}</h4>
                        <small>
                        <Money data={product.priceRange.minVariantPrice} />
                        </small>
                      </CardFooter> */}
                      </Link>
                    </Card>
                  </Tooltip>
                ))}
                <div className="-z-10 bg-gradient-to-br from-red-200 blur-3xl to-indigo-200 w-[400px] h-[400px] rounded-full absolute bottom-0 right-0 "></div>
              </div>
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
