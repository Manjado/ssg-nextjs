import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import marked from 'marked';

const Post = ({ htmlString, data }) => {
  return (
      <>
        <Head>
            <title>{data.title}</title>
            <meta title="description" content={data.description}/>
        </Head>
        <div dangerouslySetInnerHTML={{ __html: htmlString}}/>
      </>
  )
};

export const getStaticPaths = async () => {
    const files = fs.readdirSync('posts');
    const paths = files.map((filename) => ({
      params: {
        slug: filename.replace(".md", ""),
      },
    }));

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async ({params: {slug}}) => {
    //join because
    //posts/faq.md - mac
    //post\faq.md - window
    const markdownWithMetadata = fs.readFileSync(path.join("posts", slug + ".md")).toString(); // toString because read return buffer
    
    const parsedMarkdown = matter(markdownWithMetadata);

    const htmlString = marked(parsedMarkdown.content)
    
    return {
      props: {
        htmlString,
        data: parsedMarkdown.data
      },
    };
}
export default Post;